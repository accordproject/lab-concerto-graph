import { ClassDeclaration, Factory, Introspector, ModelManager, RelationshipDeclaration, Serializer } from "@accordproject/concerto-core";
import neo4j, { DateTime, Driver, ManagedTransaction, Session } from 'neo4j-driver';
import * as crypto from 'crypto'

type VectorIndex = {
    property: string;
    size: number;
    type: string;
}

export type Context = {
    session: Session;
}

export function getObjectChecksum(obj: PropertyBag) {
    const deterministicReplacer = (_, v) =>
        typeof v !== 'object' || v === null || Array.isArray(v) ? v :
            Object.fromEntries(Object.entries(v).sort(([ka], [kb]) =>
                ka < kb ? -1 : ka > kb ? 1 : 0));
    return crypto.createHash('sha256').update(JSON.stringify(obj, deterministicReplacer)).digest('hex')
}

export function getTextChecksum(text: string) {
    return crypto.createHash('sha256').update(text).digest('hex')
}

type PropertyBag = Record<string, unknown>;
export type GraphNodeProperties = PropertyBag;
type EmbeddingFunction = (text: string) => Promise<Array<number>>;
type Logger = {
    log: (text: string) => void;
}
export type GraphModelOptions = {
    embeddingFunction?: EmbeddingFunction;
    logger?: Logger;
    NEO4J_URL?: string;
    NEO4J_USER?: string;
    NEO4J_PASS?: string;
}

export const ROOT_NAMESPACE = 'org.accordproject.graph@1.0.0';
export const ROOT_MODEL = `namespace ${ROOT_NAMESPACE}
concept GraphNode identified by identifier {
    o String identifier
}
concept EmbeddingCacheNode extends GraphNode {
    @vector_index("content", 1536, "COSINE")
    o Double[] embedding
    o String content  
}
`;

/**
 * Provides typed-access to Neo4J graph database
 * with the nodes and relationships for the graph defined
 * using a Concerto model.
 */
export class GraphModel {
    modelManager: ModelManager;
    driver: Driver | undefined = undefined;
    options: GraphModelOptions;

    constructor(graphModel: string, options: GraphModelOptions) {
        this.options = options;
        this.modelManager = new ModelManager({ strict: true, enableMapType: true });
        this.modelManager.addCTOModel(ROOT_MODEL, 'root.cto');
        this.modelManager.addCTOModel(graphModel, 'model.cto');
    }

    async connect() {
        if (!this.driver) {
            this.driver = neo4j.driver(this.options.NEO4J_URL ?? 'bolt://localhost:7687',
                neo4j.auth.basic(this.options.NEO4J_USER ?? 'neo4j', this.options.NEO4J_PASS ?? 'password'));
            const serverInfo = await this.driver.getServerInfo()
            this.options.logger?.log('Connection established')
            this.options.logger?.log(JSON.stringify(serverInfo))
        }
    }

    async openSession(): Promise<Context> {
        if (this.driver) {
            const session = this.driver.session({ database: 'neo4j' })
            return { session };
        }
        throw new Error('No neo4j driver!');
    }

    async closeSession(context: Context) {
        context.session.close();
    }

    private getGraphNodeDeclaration(fqn: string) {
        const decl = this.modelManager.getType(fqn);
        const superTypesNames = decl.getAllSuperTypeDeclarations().map(s => s.getFullyQualifiedName());
        if (!superTypesNames.includes('org.accordproject.graph@1.0.0.GraphNode')) {
            throw new Error(`Type ${fqn} is not a GraphNode`);
        }
        return decl;
    }

    private getGraphNodeDeclarations() {
        const intro = new Introspector(this.modelManager);
        return intro.getClassDeclarations()
            .filter(d => d.getAllSuperTypeDeclarations()
                .find(s => s.getFullyQualifiedName() === `${ROOT_NAMESPACE}.GraphNode`));
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
        return {
            property: property.getDecorator('vector_index').getArguments()[0] as unknown as string,
            size: property.getDecorator('vector_index').getArguments()[1] as unknown as number,
            type: property.getDecorator('vector_index').getArguments()[2] as unknown as string,
        }
    }

    private getPropertyVectorIndexName(decl, vectorProperty) {
        return `${decl.getName()}_${vectorProperty.getName()}`.toLowerCase();
    }

    async dropIndexes() {
        this.options.logger?.log('Dropping indexes...');
        const { session } = await this.openSession();
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
            }
        })
        await session.close();
        this.options.logger?.log('Drop indexes completed');
    }

    async createConstraints() {
        this.options.logger?.log('Creating constraints...');
        const { session } = await this.openSession();
        await session.executeWrite(async tx => {
            const graphNodes = this.getGraphNodeDeclarations();
            for (let n = 0; n < graphNodes.length; n++) {
                const graphNode = graphNodes[n];
                await tx.run(`CREATE CONSTRAINT constraint_${graphNode.getName().toLowerCase()}_identifier FOR (a:${graphNode.getName()}) REQUIRE a.${graphNode.getIdentifierFieldName()} IS UNIQUE`);
            }
        })
        await session.close();
        this.options.logger?.log('Create constraints completed');
    }

    async createVectorIndexes() {
        this.options.logger?.log('Creating vector indexes...');
        const { session } = await this.openSession();
        await session.executeWrite(async tx => {
            const graphNodes = this.getGraphNodeDeclarations();
            for (let n = 0; n < graphNodes.length; n++) {
                const graphNode = graphNodes[n];
                const vectorProperties = graphNode.getProperties().filter(p => p.getDecorator('vector_index'));
                for (let i = 0; i < vectorProperties.length; i++) {
                    const vectorProperty = vectorProperties[i];
                    const vectorIndex = this.getPropertyVectorIndex(vectorProperty);
                    const indexName = this.getPropertyVectorIndexName(graphNode, vectorProperty);
                    await tx.run(`CALL db.index.vector.createNodeIndex("${indexName}", "${graphNode.getName()}", "${vectorProperty.getName()}", ${vectorIndex.size}, "${vectorIndex.type}")`);
                }
            }
        })
        await session.close();
        this.options.logger?.log('Create vector indexes completed');
    }

    async deleteGraph() {
        const { session } = await this.openSession();
        await session.executeWrite(async tx => {
            await tx.run('MATCH (n) DETACH DELETE n')
        })
        await session.close();
    }

    /**
     * Performs a similarity search on nodes with text content
     * @param typeName the name of the type E.g. 'Clause'
     * @param propertyName the name of the property to search. E.g. 'content'.
     * @param count the number of similar nodes to return
     * @param embeddings the embeddings for the text to search for
     * @returns
     */
    async similarityQueryFromEmbedding(typeName: string, propertyName: string, count: number, embedding) {
        const decl = this.getGraphNodeDeclaration(typeName);
        const vectorProperty = decl.getProperty(propertyName);
        if (!vectorProperty) {
            throw new Error(`${typeName} does not have a property ${propertyName}`);
        }
        // check this is a vector index property
        const vectorIndex = this.getPropertyVectorIndex(vectorProperty);
        const index = this.getPropertyVectorIndexName(decl, vectorProperty);
        const q = `MATCH (l:${typeName})
    CALL db.index.vector.queryNodes('${index}', ${count}, ${JSON.stringify(embedding)} )
    YIELD node AS similar, score
    MATCH (similar)
    RETURN similar.identifier as identifier, similar.${vectorIndex.property} as content, score limit ${count}`
        const queryResult = await this.query(q)
        return queryResult ? queryResult.records.map(v => {
            return {
                identifier: v.get('identifier'),
                content: v.get('content'),
                score: v.get('score')
            }
        }) : [];
    }

    async query(cypher: string, parameters?: PropertyBag, tx?: ManagedTransaction) {
        if (tx) {
            return tx.run(cypher, parameters)
        }
        else {
            const { session } = await this.openSession();
            await session.executeRead(async tx => {
                return tx.run(cypher, parameters);
            })
            await session.close();
        }
    }

    /**
     * Note that this merges nodes based on identifier. I.e. if a node with a given
     * identifier already exists then its properties are SET. If the node does not exist
     * then a new node is created.
     * @param transaction 
     * @param typeName 
     * @param properties 
     * @returns 
     */
    async mergeNode(transaction: ManagedTransaction, typeName: string, properties: PropertyBag) {
        const decl = this.getGraphNodeDeclaration(typeName);
        const newProperties = this.validateAndTransformProperties(decl, properties);
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
        return this.query(`MERGE (n:${decl.getName()}{identifier: $id}) ${set}`, { id, ...newProperties }, transaction);
    }

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

        const relationshipType = decorator.getArguments()[0].toString();
        return this.query(`MATCH(source:${sourceDecl.getName()} {identifier: '${sourceIdentifier}'}) MATCH(target:${targetDecl.getName()} {identifier: '${targetIdentifier}'})MERGE (source)-[:${relationshipType}]->(target)`, {}, transaction);
    }

    /**
     * We use the EmbeddingCacheNode GraphNode as a cache to ensure deterministic
     * embeddings for the same text, and to cut down on OpenAI API calls
     * @param transaction 
     * @param text 
     * @returns Promise<QueryResult<RecordShape>
     */
    private async mergeEmbeddingCacheNode(transaction, text: string) {
        const embeddingId = getTextChecksum(text);
        const queryResult = await this.query('MATCH (n:EmbeddingCacheNode{identifier:$id}) RETURN n',
            { id: embeddingId }, transaction);
        if (queryResult && queryResult.records.length > 0) {
            this.options.logger?.log('EmbeddingCacheNode cache hit');
            const node = queryResult.records[0].get('n');
            return { $class: `${ROOT_NAMESPACE}.EmbeddingCacheNode`, ...node.properties };
        } else if (this.options.embeddingFunction) {
            this.options.logger?.log('EmbeddingCacheNode cache miss');
            const embedding = await this.options.embeddingFunction(text);
            const nodeProperties = { identifier: embeddingId, embedding, content: text };
            await this.mergeNode(transaction, 'EmbeddingCacheNode', nodeProperties);
            this.options.logger?.log(`Created cache node ${embeddingId}`);
            return { $class: `${ROOT_NAMESPACE}.EmbeddingCacheNode`, ...nodeProperties };
        }
        else {
            throw new Error('No embedding function set');
        }
    }

    async similarityQuery(typeName: string, propertyName: string, count: number, searchText) {
        if (this.options.embeddingFunction) {
            const context = await this.openSession();
            const transaction = await context.session.beginTransaction();
            try {
                const textContentNode = await this.mergeEmbeddingCacheNode(transaction, searchText);
                transaction.commit();
                if (!textContentNode.embedding) {
                    throw new Error(`Internal error. Failed to get embedding for ${searchText}`);
                }
                const result = this.similarityQueryFromEmbedding(typeName, propertyName, count, textContentNode.embedding);
                return result;
            }
            catch (err) {
                this.options.logger?.log((err as object).toString());
                transaction?.rollback();
            }
        }
        else {
            return [];
        }
    }

    private validateAndTransformProperties(decl: ClassDeclaration, properties: PropertyBag): PropertyBag {
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
        keys.forEach((key) => {
            if(key !== '$class') {
                const value = properties[key];
                const property = decl.getProperty(key);
                if(!property) {
                    throw new Error(`Failed to find property ${key} in ${JSON.stringify(properties)}`);
                }
                if (property.getType() === 'DateTime') {
                    newProperties[key] = DateTime.fromStandardDate(new Date(value as string))
                } else if (value !== null && typeof value === 'object') {
                    const propertyDecl = this.modelManager.getType(property.getFullyQualifiedTypeName());
                    const childValue = this.validateAndTransformProperties(propertyDecl, value as PropertyBag);
                    Object.keys(childValue).forEach( childKey => {
                        newProperties[`${key}_${childKey}`] = childValue[childKey];
                    })
                } else if (key === '$class') {
                    // ignore
                }
                else {
                    newProperties[key] = value;
                }    
            }
        })
        return newProperties;
    }
}