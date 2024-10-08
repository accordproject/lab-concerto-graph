import { ClassDeclaration, Factory, Introspector, ModelManager, ModelUtil, Property, RelationshipDeclaration, Serializer } from '@accordproject/concerto-core';

import neo4j, { DateTime, Driver, ManagedTransaction } from 'neo4j-driver';
import { Context, EmbeddingCacheNode, FullTextIndex, GraphModelOptions, PropertyBag, SimilarityResult, ToolOptions, VectorIndex } from "./types";
import { ROOT_MODEL, ROOT_NAMESPACE } from "./model";
import { getTextChecksum, textToCypher, toOpenAiToolType } from "./functions";
import { RunnableToolFunction } from "openai/lib/RunnableFunction";

const MODELS_SEP = '----/----';

/**
 * Provides typed-access to Neo4J graph database
 * with the nodes and relationships for the graph defined
 * using a Concerto model.
 */
export class GraphModel {
    modelManager: ModelManager;
    driver: Driver | undefined = undefined;
    options: GraphModelOptions;
    defaultNamespace: string | undefined;

    /**
     * Creates a new instance of GraphModel
     * @param graphModels an array of strings in Concerto CTO format
     * @param options the options used to configure the instance
     */
    constructor(graphModels: Array<string> | undefined, options: GraphModelOptions) {
        this.options = options;
        this.modelManager = new ModelManager({ strict: true, enableMapType: true });
        this.modelManager.addCTOModel(ROOT_MODEL, 'root.cto');
        if (graphModels) {
            graphModels.forEach((model, index) => {
                const mf = this.modelManager.addCTOModel(model, `model-${index}.cto`, true);
                this.defaultNamespace = mf.getNamespace();
            })
        }
        this.modelManager.validateModelFiles();
    }

    /**
     * Connects to Neo4J
     */
    async connect() {
        if (!this.driver) {
            this.driver = neo4j.driver(this.options.NEO4J_URL ?? 'bolt://localhost:7687',
                neo4j.auth.basic(this.options.NEO4J_USER ?? 'neo4j', this.options.NEO4J_PASS ?? 'password'));
            const serverInfo = await this.driver.getServerInfo()
            this.options.logger?.info('Connection established', JSON.stringify(serverInfo))
        }
    }

    /**
     * Opens a new database session. Call 'closeSession' to
     * free resources.
     * 
     * @param database the name of the database. Defaults to 'neo4j'.
     * @returns a promise to a Context for the database.
     */
    async openSession(database = 'neo4j'): Promise<Context> {
        if (this.driver) {
            const session = this.driver.session({ database })
            return { session };
        }
        throw new Error('No neo4j driver!');
    }

    /**
     * Returns a description of the GraphModel. The description
     * is suppied using the '@description' decorator on the defaultNamespace
     * @returns the description of this domain model or undefined if it is not
     * specified
     * @param ns the namespace to use, defaults to the namespace of the last
     * model file added
     */
    getDescription(ns?: string): string | undefined {
        const namespace = ns ? ns : this.defaultNamespace;
        if (namespace) {
            const mf = this.modelManager.getModelFile(namespace);
            const description = mf.getDecorator('description');
            if (description) {
                const args = description.getArguments();
                if (args.length > 0) {
                    return args[0].toString();
                }
            }
        }
        return undefined;
    }

    /**
     * Retrieves an array of questions for the graph nodes in
     * the model. Questions are specified using the '@questions'
     * decorator on GraphNodes.
     * @returns an array of the questions associated with all the 
     * graph nodes
     */
    getQuestions(): Array<string> {
        const results: Array<string> = [];
        const decls = this.getGraphNodeDeclarations();
        for (let n = 0; n < decls.length; n++) {
            const decl = decls[n];
            const questions = decl.getDecorator('questions');
            if (questions) {
                const args = questions.getArguments();
                args.forEach(arg => {
                    results.push(arg.toString())
                })
            }
        }
        return results;
    }

    /**
     * Stores the Concerto Models in the graph
     * @returns promise to indicate the operation is complete
     */
    async mergeConcertoModels() {
        const context = await this.openSession();
        const { session } = context;
        try {
            await session.executeWrite(async transaction => {
                return this.mergeNode(transaction, 'org.accordproject.graph@1.0.0.ConcertoModels', { identifier: '000', content: this.getConcertoModels() });
            });
            this.options.logger?.info('Stored Concerto Models');
        }
        finally {
            return this.closeSession(context);
        }
    }

    /**
     * Reads the concerto model from the graph. To write it
     * use the mergeConcertoModels method.
     * @returns returns the concerto model from the graph
     */
    async queryConcertoModels(): Promise<Array<string> | undefined> {
        const context = await this.openSession();
        try {
            let result: Array<string> | undefined = undefined;
            const { session } = context;
            await session.executeRead(async transaction => {
                const models = await this.readQuery('MATCH(m:ConcertoModels where m.identifier="000") return m.content;', undefined, transaction);
                if (models.records.length === 1) {
                    result = models.records[0].get('m.content').split(MODELS_SEP).filter(m => m.trim().length > 0);
                }
            });
            return result;
        }
        finally {
            await this.closeSession(context);
        }
    }

    /**
     * Clears the models in the ModelManager and then loads the models 
     * from the graph and populates the ModelManager
     */
    async loadConcertoModels() {
        const models = await this.queryConcertoModels();
        if (!models) {
            throw new Error('Failed to query models');
        }
        this.modelManager.clearModelFiles();
        models.forEach((model, index) => {
            const mf = this.modelManager.addCTOModel(model, `model-${index}.cto`, true);
            this.defaultNamespace = mf.getNamespace();
        })
        this.modelManager.validateModelFiles();
    }

    /**
     * Closes a database context.
     * @param context the database context
     */
    async closeSession(context: Context) {
        context.session.close();
    }

    private getFullyQualifiedType(type: string) {
        const typeNs = ModelUtil.getNamespace(type);
        const typeShortName = ModelUtil.getShortName(type);
        const ns = typeNs.length > 0 ? typeNs : this.defaultNamespace;
        return ModelUtil.getFullyQualifiedName(ns ? ns : '', typeShortName);
    }

    private getGraphNodeDeclaration(typeName: string) {
        const fqn = this.getFullyQualifiedType(typeName);
        const decl = this.modelManager.getType(fqn);
        const superTypesNames = decl.getAllSuperTypeDeclarations().map(s => s.getFullyQualifiedName());
        if (!superTypesNames.includes('org.accordproject.graph@1.0.0.GraphNode')) {
            throw new Error(`Type ${fqn} is not a GraphNode`);
        }
        return decl;
    }

    private getGraphNodeDeclarations(notools?: boolean) {
        const intro = new Introspector(this.modelManager);
        const result = intro.getClassDeclarations()
            .filter(d => d.getAllSuperTypeDeclarations()
                .find(s => s.getFullyQualifiedName() === `${ROOT_NAMESPACE}.GraphNode`));
        return notools ? result.filter(decl => !decl.isAbstract() && !decl.getDecorator('notool')) : result;
    }

    private getFullTextIndex(decl): FullTextIndex | undefined {
        const properties = decl.getProperties()
            .filter(p => p.getDecorator('fulltext_index'))
            .map(p => p.getName());
        return properties.length > 0 ?
            {
                properties,
                indexName: this.getFullTextIndexName(decl),
                type: decl.getName()
            } : undefined;
    }

    private getPropertyVectorIndex(property): VectorIndex {
        const decorator = property.getDecorator('vector_index');
        if (!decorator) {
            throw new Error(`Property ${property.getFullyQualifiedName()} does not have a vector index`);
        }
        const args = decorator.getArguments();
        if (args.length !== 3) {
            throw new Error(`@vector_index decorator on property ${property.getFullyQualifiedName()} does not have three arguments`);
        }

        if (typeof args[0] !== 'string') {
            throw new Error(`@vector_index decorator on property ${property.getFullyQualifiedName()} does not have a first argument that is a string`);
        }

        if (typeof args[1] !== 'number') {
            throw new Error(`@vector_index decorator on property ${property.getFullyQualifiedName()} does not have a first argument that is a number`);
        }

        if (typeof args[2] !== 'string') {
            throw new Error(`@vector_index decorator on property ${property.getFullyQualifiedName()} does not have a second argument that is a string`);
        }

        if (property.getType() !== 'String') {
            throw new Error(`@vector_index decorator on property ${property.getFullyQualifiedName()} is invalid. Can only be added to String properties.`);
        }
        const propertyName = property.getDecorator('vector_index').getArguments()[0] as unknown as string;
        const embeddingProperty = property.getParent().getProperty(propertyName);
        if (!embeddingProperty) {
            throw new Error(`@vector_index decorator on property ${property.getFullyQualifiedName()} is invalid. References the property ${propertyName} which does not exist.`);
        }

        if (embeddingProperty.getType() !== 'Double' || !embeddingProperty.isArray()) {
            throw new Error(`@vector_index decorator on property ${property.getFullyQualifiedName()} is invalid. It references the property ${propertyName} but the property is not Double[].`);
        }
        return {
            type: property.getParent().getName(),
            property: property.getName(),
            embeddingProperty: embeddingProperty.getName(),
            size: property.getDecorator('vector_index').getArguments()[1] as unknown as number,
            indexType: property.getDecorator('vector_index').getArguments()[2] as unknown as string,
            indexName: this.getPropertyVectorIndexName(property.getParent(), property)
        }
    }

    private getPropertyVectorIndexName(decl: ClassDeclaration, vectorProperty: Property) {
        return `${decl.getName()}_${vectorProperty.getName()}`.toLowerCase();
    }

    private getFullTextIndexName(decl) {
        return `${decl.getName()}_fulltext`.toLowerCase();
    }

    /**
     * Drop all Neo4J indexes for the model.
     */
    async dropIndexes() {
        this.options.logger?.info('Dropping indexes...');
        const { session } = await this.openSession();
        try {
            await session?.executeWrite(async tx => {
                const graphNodes = this.getGraphNodeDeclarations();
                for (let n = 0; n < graphNodes.length; n++) {
                    const graphNode = graphNodes[n];
                    await tx.run(`DROP CONSTRAINT constraint_${graphNode.getName().toLowerCase()}_identifier IF EXISTS`);
                    const vectorProperties = graphNode.getProperties().filter(p => p.getDecorator('vector_index'));
                    for (let i = 0; i < vectorProperties.length; i++) {
                        const vectorProperty = vectorProperties[i];
                        const indexName = this.getPropertyVectorIndexName(graphNode, vectorProperty);
                        await tx.run(`DROP INDEX ${indexName} IF EXISTS`);
                    }
                    const fullTextIndex = this.getFullTextIndex(graphNode);
                    if (fullTextIndex) {
                        const indexName = this.getFullTextIndexName(graphNode);
                        await tx.run(`DROP INDEX ${indexName} IF EXISTS`);
                    }
                }
            })
        }
        finally {
            await session.close();
        }
        this.options.logger?.info('Drop indexes completed');
    }

    /**
     * Creates all constraints, full-text and vector indexes
     * for the model
     */
    async createIndexes() {
        await this.createConstraints();
        await this.createFullTextIndexes();
        await this.createVectorIndexes();
    }

    /**
     * Create Neo4J constraints for the model
     */
    async createConstraints() {
        this.options.logger?.info('Creating constraints...');
        const { session } = await this.openSession();
        try {
            await session.executeWrite(async tx => {
                const graphNodes = this.getGraphNodeDeclarations();
                for (let n = 0; n < graphNodes.length; n++) {
                    const graphNode = graphNodes[n];
                    await tx.run(`CREATE CONSTRAINT constraint_${graphNode.getName().toLowerCase()}_identifier IF NOT EXISTS FOR (a:${graphNode.getName()}) REQUIRE a.${graphNode.getIdentifierFieldName()} IS UNIQUE`);
                }
            })
        }
        finally {
            await session.close();
        }
        this.options.logger?.info('Create constraints completed');
    }

    /**
     * Get all the vector indexes for the model
     * @param notools filter out indexes for declarations with @notools decorator
     */
    getVectorIndexes(notools?: boolean): Array<VectorIndex> {
        const result: Array<VectorIndex> = [];
        const graphNodes = this.getGraphNodeDeclarations(notools);
        for (let n = 0; n < graphNodes.length; n++) {
            const graphNode = graphNodes[n];
            const vectorProperties = graphNode.getOwnProperties().filter(p => p.getDecorator('vector_index'));
            for (let i = 0; i < vectorProperties.length; i++) {
                const vectorProperty = vectorProperties[i];
                const vectorIndex = this.getPropertyVectorIndex(vectorProperty);
                result.push(vectorIndex);
            }
        }
        return result;
    }

    /**
     * Get all the full text indexes for the model
     * @param notools filter out indexes for declarations with @notools decorator
     */
    getFullTextIndexes(notools?: boolean): Array<FullTextIndex> {
        const result: Array<FullTextIndex> = [];
        const graphNodes = this.getGraphNodeDeclarations(notools);
        for (let n = 0; n < graphNodes.length; n++) {
            const graphNode = graphNodes[n];
            const fullTextIndex = this.getFullTextIndex(graphNode);
            if (fullTextIndex) {
                result.push(fullTextIndex)
            }
        }
        return result;
    }


    /**
     * Create vector indexes for the model
     */
    async createVectorIndexes() {
        this.options.logger?.info('Creating vector indexes...');
        const { session } = await this.openSession();
        try {
            await session.executeWrite(async tx => {
                const indexes = this.getVectorIndexes();
                for (let n = 0; n < indexes.length; n++) {
                    const index = indexes[n];
                    // console.log(JSON.stringify(index, null, 2));
                    await tx.run(`CALL db.index.vector.createNodeIndex("${index.indexName}", "${index.type}", "${index.embeddingProperty}", ${index.size}, "${index.indexType}")`);
                }
            })
        }
        finally {
            await session.close();
        }
        this.options.logger?.info('Create vector indexes completed');
    }

    /**
     * Create fulltext indexes for the model
     */
    async createFullTextIndexes() {
        this.options.logger?.info('Creating full text indexes...');
        const { session } = await this.openSession();
        try {
            await session.executeWrite(async tx => {
                const indexes = this.getFullTextIndexes();
                for (let n = 0; n < indexes.length; n++) {
                    const index = indexes[n];
                    const props = index.properties.map(p => `n.${p}`);
                    await tx.run(`CREATE FULLTEXT INDEX ${index.indexName} FOR (n:${index.type}) ON EACH [${props.join(',')}];`);
                }
            })
        }
        finally {
            await session.close();
        }
        this.options.logger?.info('Create full text indexes completed');
    }

    /**
     * Delete all nodes/edges in the graph
     */
    async deleteGraph() {
        const { session } = await this.openSession();
        try {
            await session.executeWrite(async tx => {
                return tx.run('MATCH (n) DETACH DELETE n')
            })
        }
        finally {
            await session.close();
        }
    }

    /**
     * Performs a similarity search on nodes with text content
     * @param typeName the name of the type E.g. 'Clause'
     * @param propertyName the name of the property to search. E.g. 'content'.
     * @param count the number of similar nodes to return
     * @param embedding the embeddings for the text to search for
     * @returns
     */
    async similarityQueryFromEmbedding(typeName: string, propertyName: string, embedding: Array<number>, count: number): Promise<Array<SimilarityResult>> {
        const decl = this.getGraphNodeDeclaration(typeName);
        const vectorProperty = decl.getProperty(propertyName);
        if (!vectorProperty) {
            throw new Error(`${typeName} does not have a property ${propertyName}`);
        }
        // check this is a vector index property
        this.getPropertyVectorIndex(vectorProperty);
        const index = this.getPropertyVectorIndexName(decl, vectorProperty);
        const q = `MATCH (l:${decl.getName()})
    CALL db.index.vector.queryNodes('${index}', ${count}, ${JSON.stringify(embedding)} )
    YIELD node AS similar, score
    MATCH (similar)
    RETURN similar.identifier as identifier, similar.${propertyName} as content, score limit ${count}`;
        const queryResult = await this.readQuery(q);
        return queryResult ? queryResult.records.map(v => {
            return {
                identifier: v.get('identifier'),
                content: v.get('content'),
                score: v.get('score')
            }
        }) : [];
    }

    /**
     * Runs a Cypher read query
     * @param cypher the Cypher query to execute
     * @param parameters any parameters for the query
     * @param tx the transaction
     * @returns the query results
     */
    async readQuery(cypher: string, parameters?: PropertyBag, tx?: ManagedTransaction) {
        if (this.options.logQueries) {
            this.options.logger?.info(cypher);
        }
        if (tx) {
            const ret = tx.run(cypher, parameters)
            // this.options.logger?.info('query', ret);
            return ret;
        }
        else {
            const { session } = await this.openSession();
            try {
                const result = await session.executeRead(async tx => {
                    return tx.run(cypher, parameters);
                })
                // this.options.logger?.info('query', result);    
                return result;
            }
            finally {
                await session.close();
            }
        }
    }

    /**
     * Runs a Cypher write query
     * @param cypher the Cypher query to execute
     * @param parameters any parameters for the query
     * @param tx the transaction
     * @returns the query results
     */
    async writeQuery(cypher: string, parameters?: PropertyBag, tx?: ManagedTransaction) {
        if (this.options.logQueries) {
            this.options.logger?.info(cypher);
        }
        if (tx) {
            const ret = tx.run(cypher, parameters)
            // this.options.logger?.info('query', ret);
            return ret;
        }
        else {
            const { session } = await this.openSession();
            try {
                const result = await session.executeWrite(async tx => {
                    return tx.run(cypher, parameters);
                })
                // this.options.logger?.info('query', result);
                return result;
            }
            finally {
                await session.close();
            }
        }
    }

    /**
     * Merges Nodes into the graph.
     * Note that this merges nodes based on identifier. I.e. if a node with a given
     * identifier already exists then its properties are SET. If the node does not exist
     * then a new node is created.
     * @param transaction the transaction
     * @param typeName the name of the type
     * @param properties the properties for the node
     * @returns the graph node
     */
    async mergeNode(transaction: ManagedTransaction, typeName: string, properties: PropertyBag) {
        const decl = this.getGraphNodeDeclaration(typeName);
        const newProperties = await this.validateAndTransformProperties(transaction, decl, properties);
        const id = newProperties.identifier;
        if (!id) {
            throw new Error(`Cannot merge ${typeName} without an identifier property`);
        }
        delete newProperties.identifier;
        let set = ''
        const keys = Object.keys(newProperties)
        keys.forEach((key) => {
            set += `SET n.${key}=$${key} `
        })
        return this.writeQuery(`MERGE (n:${decl.getName()}{identifier: $id}) ${set}`, { id, ...newProperties }, transaction);
    }

    /**
     * Deletes a node and any relationships attached to the node (DETACH DELETE)
     * @param transaction the transaction
     * @param typeName the name of the type
     * @param identifier the identifier for the node
     * @returns the result
     */
    async deleteNode(transaction: ManagedTransaction, typeName: string, identifier: string) {
        const decl = this.getGraphNodeDeclaration(typeName);
        return this.writeQuery(`MATCH (n:${decl.getName()} {identifier: '${identifier}'}) DETACH DELETE n`, undefined, transaction);
    }

    /**
     * Merges a relationship into the graph
     * @param transaction the transaction
     * @param sourceType the source node type of the relationship
     * @param sourceIdentifier the source identifier for the relationship
     * @param targetType the target node type
     * @param targetIdentifier the target identifier
     * @param sourcePropertyName the source property name
     * @returns the source node
     */
    async mergeRelationship(transaction: ManagedTransaction, sourceType: string, sourceIdentifier:
        string, targetType: string, targetIdentifier: string, sourcePropertyName: string) {
        const sourceDecl = this.getGraphNodeDeclaration(sourceType);
        const targetDecl = this.getGraphNodeDeclaration(targetType);
        const property = sourceDecl.getProperty(sourcePropertyName);
        if (!property) {
            throw new Error(`Failed to find property ${sourcePropertyName} in declaration ${sourceType}`);
        }
        if (!(property as RelationshipDeclaration)?.isRelationship) {
            throw new Error(`Property ${sourcePropertyName} is not a relationship`);
        }
        const decorator = property.getDecorator('label');
        if (!decorator) {
            throw new Error(`Property ${sourcePropertyName} does not have @label decorator`)
        }
        if (decorator.getArguments().length !== 1) {
            throw new Error(`Property @label decorator on ${sourcePropertyName} must have a single argument`);
        }
        // check source and target nodes exist
        if(!await this.nodeExists(sourceType, sourceIdentifier)) {
            throw new Error(`Source node of type ${sourceType} and with identifier ${sourceIdentifier} does not exist.`);
        }
        if(!await this.nodeExists(targetType, targetIdentifier)) {
            throw new Error(`Target node of type ${targetType} and with identifier ${targetIdentifier} does not exist.`);
        }
        const relationshipType = decorator.getArguments()[0].toString();
        return this.writeQuery(`MATCH(source:${sourceDecl.getName()} {identifier: '${sourceIdentifier}'}) MATCH(target:${targetDecl.getName()} {identifier: '${targetIdentifier}'})MERGE (source)-[:${relationshipType}]->(target)`, {}, transaction);
    }

    /**
     * Checks whether a node of a given type and with a given identifier exists in the graph
     * @param type the type identifier
     * @param identifier the identifier of the node
     * @returns true if the node exists
     */
    async nodeExists(type: string, identifier:string): Promise<boolean> {
        const decl = this.getGraphNodeDeclaration(type);
        const queryResult = await this.readQuery(`MATCH (n:${decl.getName()} WHERE n.identifier='${identifier}') RETURN n;`);
        const result = (queryResult && queryResult.records.length > 0);
        return result;
    }

    /**
     * We use the EmbeddingCacheNode GraphNode as a cache to ensure deterministic
     * embeddings for the same text, and to cut down on OpenAI API calls
     * @param transaction the transaction
     * @param text the text to cache
     * @returns a promise to the EmbeddingCacheNode
     */
    private async mergeEmbeddingCacheNode(transaction, text: string): Promise<EmbeddingCacheNode> {
        const embeddingId = getTextChecksum(text);
        const queryResult = await this.readQuery('MATCH (n:EmbeddingCacheNode{identifier:$id}) RETURN n',
            { id: embeddingId }, transaction);
        if (queryResult && queryResult.records.length > 0) {
            this.options.logger?.info('EmbeddingCacheNode cache hit');
            const node = queryResult.records[0].get('n');
            return { $class: `${ROOT_NAMESPACE}.EmbeddingCacheNode`, ...node.properties };
        } else if (this.options.embeddingFunction) {
            this.options.logger?.info('EmbeddingCacheNode cache miss');
            const embedding = await this.options.embeddingFunction(this.options.openAiOptions, text);
            const nodeProperties = { identifier: embeddingId, embedding, content: text };
            await this.mergeNode(transaction, `${ROOT_NAMESPACE}.EmbeddingCacheNode`, nodeProperties);
            this.options.logger?.info(`Created cache node ${embeddingId}`);
            return { $class: `${ROOT_NAMESPACE}.EmbeddingCacheNode`, ...nodeProperties };
        }
        else {
            throw new Error('No embedding function set');
        }
    }

    /**
     * Searches for similar nodes, using a vector similarity search
     * @param typeName the name of the type
     * @param propertyName the property to search over
     * @param searchText the search text
     * @param count the number of items to return
     * @returns an array of similar nodes, up to the count limit
     */
    async similarityQuery(typeName: string, propertyName: string, searchText: string, count: number): Promise<Array<SimilarityResult>> {
        const context = await this.openSession();
        const transaction = await context.session.beginTransaction();
        try {
            const textContentNode = await this.mergeEmbeddingCacheNode(transaction, searchText);
            transaction.commit();
            if (!textContentNode.embedding) {
                throw new Error(`Internal error. Failed to get embedding for ${searchText}`);
            }
            this.options.logger?.info(`Similarity query of '${typeName}.${propertyName}' for '${searchText}'`);
            const results = await this.similarityQueryFromEmbedding(typeName, propertyName, textContentNode.embedding, count);
            this.options.logger?.info('similarity', results);
            return results;
        }
        catch (err) {
            this.options.logger?.error((err as object).toString());
            transaction?.rollback();
            throw err;
        }
        finally {
            this.closeSession(context);
        }
    }

    /**
     * Returns the Concerto models as a string
     * @returns the concerto models as a string
     */
    getConcertoModels(): string {
        return this.modelManager.getModels().reduce((prev, cur) => prev += MODELS_SEP + cur.content, '');
    }

    /**
     * Converts a natural language query string to a Cypher query (without running it)
     * @param text the input text
     * @returns the Cypher query
     */
    async textToCypher(text: string): Promise<string | null> {
        return textToCypher(this.options, text, this.getConcertoModels());
    }

    /**
     * Converts the incoming natural language query to Cypher and then
     * runs the Cypher query.
     * @param text the input text
     * @returns the query results
     */
    async chatWithData(text: string) {
        const cypher = await this.textToCypher(text);
        if (cypher) {
            this.options.logger?.info(`Generated Cypher: ${cypher}`);
            const context = await this.openSession();
            const transaction = await context.session.beginTransaction();
            try {
                const queryResult = await this.readQuery(cypher);
                const ret = queryResult ? queryResult.records.map(v => {
                    const result = {};
                    v.keys.forEach(k => {
                        result[k] = v.get(k);
                    })
                    return result;
                }) : [];
                this.options.logger?.info('chatWithData', ret);
                return ret;
            }
            catch (err) {
                this.options.logger?.error((err as object).toString());
                transaction?.rollback();
                throw err;
            }
            finally {
                this.closeSession(context);
            }
        }
        throw new Error(`Failed to convert to Cypher query ${text}`);
    }

    /**
     * Uses the full text index for a type to perform a full text search
     * @param typeName the type to search
     * @param searchText the query text
     * @param count the number of items to return
     * @returns the items
     */
    async fullTextQuery(typeName: string, searchText: string, count: number) {
        try {
            const graphNode = this.getGraphNodeDeclaration(typeName);
            const fullTextIndex = this.getFullTextIndex(graphNode);
            if (!fullTextIndex) {
                throw new Error(`No full text index for properties of ${typeName}`);
            }
            this.options.logger?.info(`Fulltext search of '${typeName}' for '${searchText}'`);
            const indexName = this.getFullTextIndexName(graphNode);
            const props = fullTextIndex.properties.map(p => `node.${p}`);
            props.push('node.identifier');
            const q = `CALL db.index.fulltext.queryNodes("${indexName}", "${searchText}") YIELD node, score RETURN ${props.join(',')}, score limit ${count}`;
            const queryResult = await this.readQuery(q);
            const ret = queryResult ? queryResult.records.map(v => {
                const result = {};
                fullTextIndex.properties.forEach(p => {
                    result[p] = v.get(`node.${p}`)
                });
                result['score'] = v.get('score');
                result['identifier'] = v.get('node.identifier');
                return result;
            }) : [];
            this.options.logger?.info('fulltext', ret);
            return ret;
        }
        catch (err) {
            this.options.logger?.error((err as object).toString());
            throw err;
        }
    }

    private async validateAndTransformProperties(transaction, decl: ClassDeclaration, properties: PropertyBag): Promise<PropertyBag> {
        const factory = new Factory(this.modelManager);
        const serializer = new Serializer(factory, this.modelManager);
        const result = serializer.fromJSON({
            $class: decl.getFullyQualifiedName(),
            ...properties
        });
        if (result.getFullyQualifiedType() !== decl.getFullyQualifiedName()) {
            throw new Error(`Deserialized ${result.getFullyQualifiedType()} but expected ${decl.getFullyQualifiedName()}`);
        }
        const keys = Object.keys(properties)
        const newProperties = {};
        for (let n = 0; n < keys.length; n++) {
            const key = keys[n];
            if (key !== '$class') {
                const value = properties[key];
                const property = decl.getProperty(key);
                if (value !== undefined) {
                    const embeddingDecorator = property.getDecorator('vector_index');
                    if (decl.getFullyQualifiedName() !== `${ROOT_NAMESPACE}.EmbeddingCacheNode` &&
                        embeddingDecorator && this.options.embeddingFunction) {
                        const vectorIndex = this.getPropertyVectorIndex(property);
                        if (typeof value !== 'string') {
                            throw new Error(`Can only calculate embedding for string properties`);
                        }
                        const cacheNode = await this.mergeEmbeddingCacheNode(transaction, value as string);
                        newProperties[vectorIndex.embeddingProperty] = cacheNode.embedding;
                        newProperties[key] = value;
                    }
                    else if (property.getType() === 'DateTime') {
                        newProperties[key] = DateTime.fromStandardDate(new Date(value as string))
                    } else if (value !== null && !Array.isArray(value) && typeof value === 'object') {
                        const propertyDecl = this.modelManager.getType(property.getFullyQualifiedTypeName());
                        if (!propertyDecl.isMapDeclaration()) {
                            const childValue: PropertyBag = await this.validateAndTransformProperties(transaction, propertyDecl, value as PropertyBag);
                            Object.keys(childValue).forEach(childKey => {
                                newProperties[`${key}_${childKey}`] = childValue[childKey];
                            });
                        }
                        else {
                            Object.keys(value).forEach(childKey => {
                                if (key !== '$class') {
                                    const childValue = value[childKey];
                                    // TODO DCS - support map values that are objects...
                                    newProperties[`${key}_${childKey}`.replace(/ /g, "_").replace(/./g, "_")] = childValue;
                                }
                            });
                        }
                    }
                    else {
                        newProperties[key] = value;
                    }
                }
            }
        }
        return newProperties;
    }

    /**
    * Converts a GraphNode to its Open AI tool parameter representation
    * @param graphNode the graphnode to convert to tool parameters
    * @returns a tool parameter object
    */
    private getToolParameters(graphNode: ClassDeclaration) {
        const vectorIndexes = this.getVectorIndexes(true);
        const notRelationships = graphNode.getProperties().filter(p => !(p as RelationshipDeclaration).isRelationship);
        const notVectorIndexed = notRelationships.filter(p => vectorIndexes.find(vi => vi.embeddingProperty === p.getName()) === undefined);
        // TODO DCS - this means that complex types must always be optional!
        const notComplex = notVectorIndexed.filter(p => toOpenAiToolType(p.getType()));
        const required = notComplex.filter(p => !p.isOptional()).map(p => p.getName());
        const properties = {};
        notComplex.forEach(p => {
            const jsonSchemaType = toOpenAiToolType(p.getType());
            if (jsonSchemaType)
                properties[p.getName()] = {
                    type: p.isArray() ? 'array' : jsonSchemaType
                }
            if (p.isArray()) {
                properties[p.getName()].items = {
                    type: jsonSchemaType
                }
            }
        });

        const result = {
            type: "object",
            properties,
            required
        }
        return result;
    }

    /**
     * Creates OpenAI tools for the model
     * @returns an array of OpenAI tool definitions
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTools(options: ToolOptions): Array<RunnableToolFunction<any>> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: Array<RunnableToolFunction<any>> = [];
        if (options.currentDateTime) {
            result.push({
                type: "function",
                function: {
                    description: 'Get current date and time',
                    name: 'get_current_datetime',
                    function: (async () => {
                        return new Date().toISOString();
                    }),
                    parse: JSON.parse,
                    parameters: {
                        "type": "object",
                        "properties": {},
                        "required": []
                    }
                }
            })
        }

        if (options.getById) {
            const nodes = this.getGraphNodeDeclarations(true);
            for (let n = 0; n < nodes.length; n++) {
                const node = nodes[n];
                // the declaration itself
                result.push({
                    type: "function",
                    function: {
                        description: `Get a ${node.getName()} by id`,
                        name: `get_${node.getName().toLowerCase()}_by_id`,
                        function: (async (args: { name: string }) => {
                            const { name } = args;
                            try {
                                const result = await this.readQuery(`MATCH (n:${node.getName()} WHERE n.identifier='${name}') RETURN n;`);
                                const ret = result ? result.records.map(v => {
                                    const result = {};
                                    v.keys.forEach(k => {
                                        result[k] = v.get(k);
                                    })
                                    return result;
                                }) : [];
                                this.options.logger?.info(`get_${node.getName().toLowerCase()}_by_id`, ret);
                                return ret;
                            }
                            catch (err) {
                                return `An error occurred: ${err}`;
                            }
                        }),
                        parse: JSON.parse,
                        parameters: {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                }
                            },
                            "required": ["name"]
                        }
                    }
                })
            }
        }

        // chat with data...
        if (options.chatWithData) {
            result.push({
                type: "function",
                function: {
                    description: `Get data from a natural language query`,
                    name: `chat_with_data`,
                    function: (async (args: { query: string }) => {
                        const { query } = args;
                        try {
                            return await this.chatWithData(query);
                        }
                        catch (err) {
                            return `An error occurred: ${err}`;
                        }
                    }),
                    parse: JSON.parse,
                    parameters: {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                            }
                        },
                        "required": ["query"]
                    }
                }
            })
        }

        // merge nodes and relationships to graph
        if (options.mergeNodesAndRelationships) {
            const nodes = this.getGraphNodeDeclarations(true);
            for (let n = 0; n < nodes.length; n++) {
                const node = nodes[n];
                const relationships = node.getProperties().filter(p => (p as RelationshipDeclaration)?.isRelationship) as RelationshipDeclaration[];
                for (let i = 0; i < relationships.length; i++) {
                    const relationship = relationships[i];
                    result.push({
                        type: "function",
                        function: {
                            description: `Add a relationship ${relationship.getName()} from node ${node.getName()} to node ${relationship.getType()} to the knowledge graph`,
                            name: `merge_relationship_${node.getName().toLowerCase()}_${relationship.getName().toLowerCase()}`,
                            function: (async (args: { sourceType: string, sourceIdentifier: string, targetType: string, targetIdentifier: string, sourcePropertyName: string }) => {
                                const context = await this.openSession();
                                const { session } = context;
                                try {
                                    await session.executeWrite(async transaction => {
                                        return this.mergeRelationship(transaction, args.sourceType, args.sourceIdentifier, args.targetType, args.targetIdentifier, args.sourcePropertyName);
                                    });
                                    const ret = `created relationship ${relationship.getName()} between source node ${args.sourceIdentifier} and target node ${args.targetIdentifier}`;
                                    this.options.logger?.info(ret);
                                    return ret;
                                }
                                catch (err) {
                                    this.options.logger?.error(err);
                                    return `An error occurred: ${err}`;
                                }
                                finally {
                                    this.closeSession(context);
                                }
                            }),
                            parse: JSON.parse,
                            parameters: {
                                "type": "object",
                                "properties": {
                                    "sourceType": {
                                        "type": "string",
                                    },
                                    "sourceIdentifier": {
                                        "type": "string",
                                    },
                                    "targetType": {
                                        "type": "string",
                                    },
                                    "targetIdentifier": {
                                        "type": "string",
                                    },
                                    "sourcePropertyName": {
                                        "type": "string",
                                    }
                                },
                                "required": ["sourceType", "sourceIdentifier", "targetType", "targetIdentifier", "sourcePropertyName"]
                            }
                        }
                    });
                }

                const parameters = this.getToolParameters(node);
                result.push({
                    type: "function",
                    function: {
                        description: `Add a node ${node.getName()} to the knowledge graph`,
                        name: `merge_node_${node.getName().toLowerCase()}`,
                        function: (async (args) => {
                            const context = await this.openSession();
                            const { session } = context;
                            try {
                                await session.executeWrite(async transaction => {
                                    return this.mergeNode(transaction, node.getName(), args);
                                });
                                const ret = `created node ${node.getName()} with identifier ${args.identifier}`;
                                this.options.logger?.info(ret);
                                return ret;
                            }
                            catch (err) {
                                return `An error occurred: ${err}`;
                            }
                            finally {
                                this.closeSession(context);
                            }
                        }),
                        parse: JSON.parse,
                        parameters
                    }
                })
            }
        }

        // full text search
        if (options.fullTextSearch) {
            const fullTextIndexes = this.getFullTextIndexes(true);
            for (let n = 0; n < fullTextIndexes.length; n++) {
                const index = fullTextIndexes[n];
                result.push({
                    type: "function",
                    function: {
                        description: `Fulltext search over ${index.type}`,
                        name: `fulltext_${index.type.toLowerCase()}`,
                        function: (async (args: { search: string, count?: number }) => {
                            const { search, count } = args;
                            try {
                                return await this.fullTextQuery(index.type, search, count ? count : 10);
                            }
                            catch (err) {
                                return `An error occurred: ${err}`;
                            }
                        }),
                        parse: JSON.parse,
                        parameters: {
                            "type": "object",
                            "properties": {
                                "search": {
                                    "type": "string",
                                },
                                "count": {
                                    "type": "number",
                                }
                            },
                            "required": ["search"]
                        }
                    }
                })
            }
        }

        // similarity search
        if (options.similaritySearch) {
            const vectorIndexes = this.getVectorIndexes(true);
            for (let n = 0; n < vectorIndexes.length; n++) {
                const index = vectorIndexes[n];
                result.push({
                    type: "function",
                    function: {
                        description: `Similiarity search over ${index.type}.${index.property}`,
                        name: `similarity_${index.type.toLowerCase()}_${index.property.toLowerCase()}`,
                        function: (async (args: { query: string, property: string, count?: number }) => {
                            const { query, count } = args;
                            try {
                                return await this.similarityQuery(index.type, index.property, query, count ? count : 10);
                            }
                            catch (err) {
                                return `An error occurred: ${err}`;
                            }
                        }),
                        parse: JSON.parse,
                        parameters: {
                            "type": "object",
                            "properties": {
                                "query": {
                                    "type": "string",
                                },
                                "count": {
                                    "type": "number",
                                }
                            },
                            "required": ["query"]
                        }
                    }
                })
            }
        }
        return result;
    }

    /**
     * Adds sample instances of all types to the graph and creates relationships between them.
     * Useful for visualizing the model as a graph.
     */
    async mergeSamplesToGraph() {
        const visitor = {
            visit: async (thing, parameters) => {
                if (thing.isModelManager?.()) {
                    await visitor.visitModelManager(thing, parameters);
                } else if (thing.isModelFile?.()) {
                    await visitor.visitModelFile(thing, parameters);
                }
                if (thing.isClassDeclaration?.()) {
                    await visitor.visitClassDeclaration(thing, parameters);
                } else if (thing.isRelationship?.()) {
                    await visitor.visitRelationshipDeclaration(thing, parameters);
                }
            },
            visitModelManager: async (modelManager, parameters) => {
                for (const modelFile of modelManager.getModelFiles(true)) {
                    await modelFile.accept(visitor, parameters);
                }
                return null;
            },
            visitModelFile: async (modelFile, parameters) => {
                for (const decl of modelFile.getAllDeclarations()) {
                    await decl.accept(visitor, parameters);
                }
                return null;
            },
            visitClassDeclaration: async (thing, parameters) => {
                if (!thing.isAbstract() && thing.isIdentified() && thing.getNamespace() !== ROOT_NAMESPACE) {
                    if (parameters.createNodes) {
                        const context = await this.openSession();
                        const { session } = context;
                        try {
                            await session.executeWrite(async transaction => {
                                const factory = new Factory(this.modelManager);
                                const sample = factory.newConcept(thing.getNamespace(), thing.getName(), thing.getName(), { generate: 'sample' });
                                if (sample.instanceOf(`${ROOT_NAMESPACE}.GraphNode`)) {
                                    return this.mergeNode(transaction, thing.getName(), sample.toJSON());
                                }
                            });
                        }
                        finally {
                            await this.closeSession(context);
                        }
                    }
                    if (parameters.createEdges) {
                        for (const property of thing.getProperties()) {
                            await property.accept(visitor, { parent: thing, ...parameters });
                        }
                    }
                }
            },
            visitRelationshipDeclaration: async (relationship, parameters) => {
                if (relationship.getDecorator('label')) {
                    const context = await this.openSession();
                    const { session } = context;
                    try {
                        await session.executeWrite(async transaction => {
                            const relClass = this.modelManager.getType(relationship.getFullyQualifiedTypeName());
                            const assignableClasses = relClass.getAssignableClassDeclarations();
                            for (let n = 0; n < assignableClasses.length; n++) {
                                const clazz = assignableClasses[n];
                                const parentType = parameters.parent.getName();
                                await this.mergeRelationship(transaction, parentType, parentType, clazz.getName(), clazz.getName(), relationship.getName());
                            }
                        });
                    }
                    finally {
                        await this.closeSession(context);
                    }
                }
            },
        };
        await this.modelManager.accept(visitor, { createNodes: true });
        await this.modelManager.accept(visitor, { createEdges: true });
    }
}