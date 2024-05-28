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

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `graphModels` | `string`[] | an array of strings in Concerto CTO format |
| `options` | [`GraphModelOptions`](../type-aliases/GraphModelOptions.md) | the options used to configure the instance |

#### Returns

[`GraphModel`](GraphModel.md)

#### Source

[graphmodel.ts:24](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L24)

## Properties

| Property | Type | Default value |
| :------ | :------ | :------ |
| `defaultNamespace` | `undefined` \| `string` | `undefined` |
| `driver` | `undefined` \| `Driver` | `undefined` |
| `modelManager` | `ModelManager` | `undefined` |
| `options` | [`GraphModelOptions`](../type-aliases/GraphModelOptions.md) | `undefined` |

## Methods

### chatWithData()

> **chatWithData**(`text`): `Promise`\<`object`[]\>

Converts the incoming natural language query to Cypher and then
runs the Cypher query.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the input text |

#### Returns

`Promise`\<`object`[]\>

the query results

#### Source

[graphmodel.ts:493](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L493)

***

### closeSession()

> **closeSession**(`context`): `Promise`\<`void`\>

Closes a database context.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `context` | [`Context`](../type-aliases/Context.md) | the database context |

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:67](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L67)

***

### connect()

> **connect**(): `Promise`\<`void`\>

Connects to Neo4J

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:38](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L38)

***

### createConstraints()

> **createConstraints**(): `Promise`\<`void`\>

Create Neo4J constraints for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:199](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L199)

***

### createFullTextIndexes()

> **createFullTextIndexes**(): `Promise`\<`void`\>

Create fulltext indexes for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:269](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L269)

***

### createIndexes()

> **createIndexes**(): `Promise`\<`void`\>

Creates all constraints, full-text and vector indexes
for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:190](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L190)

***

### createVectorIndexes()

> **createVectorIndexes**(): `Promise`\<`void`\>

Create vector indexes for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:251](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L251)

***

### deleteGraph()

> **deleteGraph**(): `Promise`\<`void`\>

Delete all nodes/edges in the graph

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:287](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L287)

***

### deleteNode()

> **deleteNode**(`transaction`, `typeName`, `identifier`): `Promise`\<`QueryResult`\<`RecordShape`\>\>

Deletes a node and any relationships attached to the node (DETACH DELETE)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `ManagedTransaction` | the transaction |
| `typeName` | `string` | the name of the type |
| `identifier` | `string` | the identifier for the node |

#### Returns

`Promise`\<`QueryResult`\<`RecordShape`\>\>

the result

#### Source

[graphmodel.ts:384](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L384)

***

### dropIndexes()

> **dropIndexes**(): `Promise`\<`void`\>

Drop all Neo4J indexes for the model.

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:161](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L161)

***

### fullTextQuery()

> **fullTextQuery**(`typeName`, `searchText`, `count`): `Promise`\<`object`[]\>

Uses the full text index for a type to perform a full text search

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `typeName` | `string` | the type to search |
| `searchText` | `string` | the query text |
| `count` | `number` | the number of items to return |

#### Returns

`Promise`\<`object`[]\>

the items

#### Source

[graphmodel.ts:525](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L525)

***

### getFullTextIndexes()

> **getFullTextIndexes**(): [`FullTextIndex`](../type-aliases/FullTextIndex.md)[]

Get all the full text indexes for the model

#### Returns

[`FullTextIndex`](../type-aliases/FullTextIndex.md)[]

#### Source

[graphmodel.ts:234](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L234)

***

### getTools()

> **getTools**(`options`): `RunnableToolFunction`\<`any`\>[]

Creates OpenAI tools for the model

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`ToolOptions`](../type-aliases/ToolOptions.md) |

#### Returns

`RunnableToolFunction`\<`any`\>[]

an array of OpenAI tool definitions

#### Source

[graphmodel.ts:617](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L617)

***

### getVectorIndexes()

> **getVectorIndexes**(): [`VectorIndex`](../type-aliases/VectorIndex.md)[]

Get all the vector indexes for the model

#### Returns

[`VectorIndex`](../type-aliases/VectorIndex.md)[]

#### Source

[graphmodel.ts:216](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L216)

***

### mergeNode()

> **mergeNode**(`transaction`, `typeName`, `properties`): `Promise`\<`QueryResult`\<`RecordShape`\>\>

Merges Nodes into the graph.
Note that this merges nodes based on identifier. I.e. if a node with a given
identifier already exists then its properties are SET. If the node does not exist
then a new node is created.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `ManagedTransaction` | the transaction |
| `typeName` | `string` | the name of the type |
| `properties` | [`PropertyBag`](../type-aliases/PropertyBag.md) | the properties for the node |

#### Returns

`Promise`\<`QueryResult`\<`RecordShape`\>\>

the graph node

#### Source

[graphmodel.ts:361](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L361)

***

### mergeRelationship()

> **mergeRelationship**(`transaction`, `sourceType`, `sourceIdentifier`, `targetType`, `targetIdentifier`, `sourcePropertyName`): `Promise`\<`QueryResult`\<`RecordShape`\>\>

Merges a relationship into the graph

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `transaction` | `ManagedTransaction` | the transaction |
| `sourceType` | `string` | the source node type of the relationship |
| `sourceIdentifier` | `string` | the source identifier for the relationship |
| `targetType` | `string` | the target node type |
| `targetIdentifier` | `string` | the target identifier |
| `sourcePropertyName` | `string` | the source property name |

#### Returns

`Promise`\<`QueryResult`\<`RecordShape`\>\>

the source node

#### Source

[graphmodel.ts:399](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L399)

***

### openSession()

> **openSession**(`database`): `Promise`\<[`Context`](../type-aliases/Context.md)\>

Opens a new database session. Call 'closeSession' to
free resources.

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `database` | `string` | `'neo4j'` | the name of the database. Defaults to 'neo4j'. |

#### Returns

`Promise`\<[`Context`](../type-aliases/Context.md)\>

a promise to a Context for the database.

#### Source

[graphmodel.ts:55](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L55)

***

### query()

> **query**(`cypher`, `parameters`?, `tx`?): `Promise`\<`QueryResult`\<`RecordShape`\>\>

Runs a Cypher query

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `cypher` | `string` | the Cypher query to execute |
| `parameters`? | [`PropertyBag`](../type-aliases/PropertyBag.md) | any parameters for the query |
| `tx`? | `ManagedTransaction` | the transaction |

#### Returns

`Promise`\<`QueryResult`\<`RecordShape`\>\>

the query results

#### Source

[graphmodel.ts:334](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L334)

***

### similarityQuery()

> **similarityQuery**(`typeName`, `propertyName`, `searchText`, `count`): `Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

Searches for similar nodes, using a vector similarity search

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `typeName` | `string` | the name of the type |
| `propertyName` | `string` | the property to search over |
| `searchText` | `string` | the search text |
| `count` | `number` | the number of items to return |

#### Returns

`Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

an array of similar nodes, up to the count limit

#### Source

[graphmodel.ts:458](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L458)

***

### similarityQueryFromEmbedding()

> **similarityQueryFromEmbedding**(`typeName`, `propertyName`, `embedding`, `count`): `Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

Performs a similarity search on nodes with text content

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `typeName` | `string` | the name of the type E.g. 'Clause' |
| `propertyName` | `string` | the name of the property to search. E.g. 'content'. |
| `embedding` | `number`[] | the embeddings for the text to search for |
| `count` | `number` | the number of similar nodes to return |

#### Returns

`Promise`\<[`SimilarityResult`](../type-aliases/SimilarityResult.md)[]\>

#### Source

[graphmodel.ts:303](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L303)

***

### textToCypher()

> **textToCypher**(`text`): `Promise`\<`null` \| `string`\>

Converts a natural language query string to a Cypher query (without running it)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the input text |

#### Returns

`Promise`\<`null` \| `string`\>

the Cypher query

#### Source

[graphmodel.ts:482](https://github.com/accordproject/lab-concerto-graph/blob/8f4fb74348d19b37d903f29e81aaec4eca02a552/src/graphmodel.ts#L482)
