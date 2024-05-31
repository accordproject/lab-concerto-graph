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
| `graphModels` | `undefined` \| `string`[] | an array of strings in Concerto CTO format |
| `options` | [`GraphModelOptions`](../type-aliases/GraphModelOptions.md) | the options used to configure the instance |

#### Returns

[`GraphModel`](GraphModel.md)

#### Source

[graphmodel.ts:26](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L26)

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

[graphmodel.ts:581](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L581)

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

[graphmodel.ts:143](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L143)

***

### connect()

> **connect**(): `Promise`\<`void`\>

Connects to Neo4J

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:42](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L42)

***

### createConstraints()

> **createConstraints**(): `Promise`\<`void`\>

Create Neo4J constraints for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:275](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L275)

***

### createFullTextIndexes()

> **createFullTextIndexes**(): `Promise`\<`void`\>

Create fulltext indexes for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:345](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L345)

***

### createIndexes()

> **createIndexes**(): `Promise`\<`void`\>

Creates all constraints, full-text and vector indexes
for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:266](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L266)

***

### createVectorIndexes()

> **createVectorIndexes**(): `Promise`\<`void`\>

Create vector indexes for the model

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:327](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L327)

***

### deleteGraph()

> **deleteGraph**(): `Promise`\<`void`\>

Delete all nodes/edges in the graph

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:363](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L363)

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

[graphmodel.ts:463](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L463)

***

### dropIndexes()

> **dropIndexes**(): `Promise`\<`void`\>

Drop all Neo4J indexes for the model.

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:237](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L237)

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

[graphmodel.ts:615](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L615)

***

### getConcertoModels()

> **getConcertoModels**(): `string`

Returns the Concerto models as a string

#### Returns

`string`

the concerto models as a string

#### Source

[graphmodel.ts:562](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L562)

***

### getDescription()

> **getDescription**(`ns`?): `undefined` \| `string`

Returns a description of the GraphModel. The description
is suppied using the '@description' decorator on the defaultNamespace

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `ns`? | `string` | the namespace to use, defaults to the namespace of the last model file added |

#### Returns

`undefined` \| `string`

the description of this domain model or undefined if it is not
specified

#### Source

[graphmodel.ts:74](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L74)

***

### getFullTextIndexes()

> **getFullTextIndexes**(): [`FullTextIndex`](../type-aliases/FullTextIndex.md)[]

Get all the full text indexes for the model

#### Returns

[`FullTextIndex`](../type-aliases/FullTextIndex.md)[]

#### Source

[graphmodel.ts:310](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L310)

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

[graphmodel.ts:709](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L709)

***

### getVectorIndexes()

> **getVectorIndexes**(): [`VectorIndex`](../type-aliases/VectorIndex.md)[]

Get all the vector indexes for the model

#### Returns

[`VectorIndex`](../type-aliases/VectorIndex.md)[]

#### Source

[graphmodel.ts:292](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L292)

***

### loadConcertoModels()

> **loadConcertoModels**(): `Promise`\<`void`\>

Clears the models in the ModelManager and then loads the models 
from the graph and populates the ModelManager

#### Returns

`Promise`\<`void`\>

#### Source

[graphmodel.ts:126](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L126)

***

### mergeConcertoModels()

> **mergeConcertoModels**(): `Promise`\<`void`\>

Stores the Concerto Models in the graph

#### Returns

`Promise`\<`void`\>

promise to indicate the operation is complete

#### Source

[graphmodel.ts:93](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L93)

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

[graphmodel.ts:440](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L440)

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

[graphmodel.ts:478](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L478)

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

[graphmodel.ts:58](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L58)

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

[graphmodel.ts:410](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L410)

***

### queryConcertoModels()

> **queryConcertoModels**(): `Promise`\<`undefined` \| `string`[]\>

Reads the concerto model from the graph. To write it
use the mergeConcertoModels method.

#### Returns

`Promise`\<`undefined` \| `string`[]\>

returns the concerto model from the graph

#### Source

[graphmodel.ts:108](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L108)

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

[graphmodel.ts:537](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L537)

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

[graphmodel.ts:379](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L379)

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

[graphmodel.ts:571](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/graphmodel.ts#L571)
