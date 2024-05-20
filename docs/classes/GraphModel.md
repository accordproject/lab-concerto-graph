[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / GraphModel

# Class: GraphModel

Provides typed-access to Neo4J graph database
with the nodes and relationships for the graph defined
using a Concerto model.

## Constructors

### new GraphModel()

> **new GraphModel**(`graphModels`, `options`): [`GraphModel`](GraphModel.md)

Creates a new instance of GraphModel

#### Parameters

• **graphModels**: `string`[]

an array of strings in Concerto CTO format

• **options**: [`GraphModelOptions`](../type-aliases/GraphModelOptions.md)

the options used to configure the instance

#### Returns

[`GraphModel`](GraphModel.md)

#### Source

[graphmodel.ts:252](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L252)

## Properties

### defaultNamespace

> **defaultNamespace**: `undefined` \| `string`

#### Source

[graphmodel.ts:245](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L245)

***

### driver

> **driver**: `undefined` \| `Driver` = `undefined`

#### Source

[graphmodel.ts:243](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L243)

***

### modelManager

> **modelManager**: `ModelManager`

#### Source

[graphmodel.ts:242](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L242)

***

### options

> **options**: [`GraphModelOptions`](../type-aliases/GraphModelOptions.md)

#### Source

[graphmodel.ts:244](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L244)

## Methods

### chatWithData()

> **chatWithData**(`text`): `Promise`\<`object`[]\>

Converts the incoming natural language query to Cypher and then
runs the Cypher query.

#### Parameters

• **text**: `string`

the input text

#### Returns

`Promise`\<`object`[]\>

the query results

#### Source

[graphmodel.ts:662](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L662)

***

### closeSession()

> **closeSession**(`context`): `Promise`\<`void`\>

Closes a database context.

#### Parameters

• **context**: [`Context`](../type-aliases/Context.md)

the database context

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:295](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L295)

***

### connect()

> **connect**(): `Promise`\<`void`\>

Connects to Neo4J

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:266](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L266)

***

### createConstraints()

> **createConstraints**(): `Promise`\<`void`\>

Create Neo4J constraints for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:410](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L410)

***

### createFullTextIndexes()

> **createFullTextIndexes**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:447](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L447)

***

### createVectorIndexes()

> **createVectorIndexes**(): `Promise`\<`void`\>

Create vector indexes for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:427](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L427)

***

### deleteGraph()

> **deleteGraph**(): `Promise`\<`void`\>

Delete all nodes/edges in the graph

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:469](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L469)

***

### dropIndexes()

> **dropIndexes**(): `Promise`\<`void`\>

Drop all Neo4J indexes for the model.

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:382](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L382)

***

### fullTextQuery()

> **fullTextQuery**(`typeName`, `searchText`, `count`): `Promise`\<`object`[]\>

Uses the full text index for a type to perform a full text search

#### Parameters

• **typeName**: `string`

the type to search

• **searchText**: `string`

the query text

• **count**: `number`

the number of items to return

#### Returns

`Promise`\<`object`[]\>

the items

#### Source

[graphmodel.ts:693](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L693)

***

### getFullTextIndex()

> `private` **getFullTextIndex**(`decl`): `undefined` \| `FullTextIndex`

#### Parameters

• **decl**: `any`

#### Returns

`undefined` \| `FullTextIndex`

#### Source

[graphmodel.ts:323](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L323)

***

### getFullTextIndexName()

> `private` **getFullTextIndexName**(`decl`): `string`

#### Parameters

• **decl**: `any`

#### Returns

`string`

#### Source

[graphmodel.ts:375](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L375)

***

### getFullyQualifiedType()

> `private` **getFullyQualifiedType**(`type`): `string`

#### Parameters

• **type**: `string`

#### Returns

`string`

#### Source

[graphmodel.ts:299](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L299)

***

### getGraphNodeDeclaration()

> `private` **getGraphNodeDeclaration**(`typeName`): `ClassDeclaration`

#### Parameters

• **typeName**: `string`

#### Returns

`ClassDeclaration`

#### Source

[graphmodel.ts:306](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L306)

***

### getGraphNodeDeclarations()

> `private` **getGraphNodeDeclarations**(): `ClassDeclaration`[]

#### Returns

`ClassDeclaration`[]

#### Source

[graphmodel.ts:316](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L316)

***

### getPropertyVectorIndex()

> `private` **getPropertyVectorIndex**(`property`): `VectorIndex`

#### Parameters

• **property**: `any`

#### Returns

`VectorIndex`

#### Source

[graphmodel.ts:330](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L330)

***

### getPropertyVectorIndexName()

> `private` **getPropertyVectorIndexName**(`decl`, `vectorProperty`): `string`

#### Parameters

• **decl**: `any`

• **vectorProperty**: `any`

#### Returns

`string`

#### Source

[graphmodel.ts:371](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L371)

***

### mergeEmbeddingCacheNode()

> `private` **mergeEmbeddingCacheNode**(`transaction`, `text`): `Promise`\<`EmbeddingCacheNode`\>

We use the EmbeddingCacheNode GraphNode as a cache to ensure deterministic
embeddings for the same text, and to cut down on OpenAI API calls

#### Parameters

• **transaction**: `any`

the transaction

• **text**: `string`

the text to cache

#### Returns

`Promise`\<`EmbeddingCacheNode`\>

a promise to the EmbeddingCacheNode

#### Source

[graphmodel.ts:599](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L599)

***

### mergeNode()

> **mergeNode**(`transaction`, `typeName`, `properties`): `Promise`\<`QueryResult`\<`RecordShape`\>\>

Merges Nodes into the graph.
Note that this merges nodes based on identifier. I.e. if a node with a given
identifier already exists then its properties are SET. If the node does not exist
then a new node is created.

#### Parameters

• **transaction**: `ManagedTransaction`

the transaction

• **typeName**: `string`

the name of the type

• **properties**: `PropertyBag`

the properties for the node

#### Returns

`Promise`\<`QueryResult`\<`RecordShape`\>\>

the graph node

#### Source

[graphmodel.ts:543](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L543)

***

### mergeRelationship()

> **mergeRelationship**(`transaction`, `sourceType`, `sourceIdentifier`, `targetType`, `targetIdentifier`, `sourcePropertyName`): `Promise`\<`QueryResult`\<`RecordShape`\>\>

Merges a relationship into the graph

#### Parameters

• **transaction**: `ManagedTransaction`

the transaction

• **sourceType**: `string`

the source node type of the relationship

• **sourceIdentifier**: `string`

the source identifier for the relationship

• **targetType**: `string`

the target node type

• **targetIdentifier**: `string`

the target identifier

• **sourcePropertyName**: `string`

the source property name

#### Returns

`Promise`\<`QueryResult`\<`RecordShape`\>\>

the source node

#### Source

[graphmodel.ts:569](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L569)

***

### openSession()

> **openSession**(`database`): `Promise`\<[`Context`](../type-aliases/Context.md)\>

Opens a new database session. Call 'closeSession' to
free resources.

#### Parameters

• **database**: `string`= `'neo4j'`

the name of the database. Defaults to 'neo4j'.

#### Returns

`Promise`\<[`Context`](../type-aliases/Context.md)\>

a promise to a Context for the database.

#### Source

[graphmodel.ts:283](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L283)

***

### query()

> **query**(`cypher`, `parameters`?, `tx`?): `Promise`\<`QueryResult`\<`RecordShape`\>\>

Runs a Cypher query

#### Parameters

• **cypher**: `string`

the Cypher query to execute

• **parameters?**: `PropertyBag`

any parameters for the query

• **tx?**: `ManagedTransaction`

the transaction

#### Returns

`Promise`\<`QueryResult`\<`RecordShape`\>\>

the query results

#### Source

[graphmodel.ts:516](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L516)

***

### similarityQuery()

> **similarityQuery**(`typeName`, `propertyName`, `searchText`, `count`): `Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

Searches for similar nodes, using a vector similarity search

#### Parameters

• **typeName**: `string`

the name of the type

• **propertyName**: `string`

the property to search over

• **searchText**: `string`

the search text

• **count**: `number`

the number of items to return

#### Returns

`Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

an array of similar nodes, up to the count limit

#### Source

[graphmodel.ts:628](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L628)

***

### similarityQueryFromEmbedding()

> **similarityQueryFromEmbedding**(`typeName`, `propertyName`, `embedding`, `count`): `Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

Performs a similarity search on nodes with text content

#### Parameters

• **typeName**: `string`

the name of the type E.g. 'Clause'

• **propertyName**: `string`

the name of the property to search. E.g. 'content'.

• **embedding**: `number`[]

the embeddings for the text to search for

• **count**: `number`

the number of similar nodes to return

#### Returns

`Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

#### Source

[graphmodel.ts:485](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L485)

***

### textToCypher()

> **textToCypher**(`text`): `Promise`\<`null` \| `string`\>

Converts a natural language query string to a Cypher query

#### Parameters

• **text**: `string`

the input text

#### Returns

`Promise`\<`null` \| `string`\>

the Cypher query

#### Source

[graphmodel.ts:651](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L651)

***

### validateAndTransformProperties()

> `private` **validateAndTransformProperties**(`transaction`, `decl`, `properties`): `Promise`\<`PropertyBag`\>

#### Parameters

• **transaction**: `any`

• **decl**: `ClassDeclaration`

• **properties**: `PropertyBag`

#### Returns

`Promise`\<`PropertyBag`\>

#### Source

[graphmodel.ts:721](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L721)
