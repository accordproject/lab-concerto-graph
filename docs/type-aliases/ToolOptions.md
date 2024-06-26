[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / ToolOptions

# Type alias: ToolOptions

> **ToolOptions**: `object`

Options for tool generation from the model

## Type declaration

### chatWithData?

> `optional` **chatWithData**: `boolean`

Creates tools to retrieve nodes via generation of Cypher from natural language

### currentDateTime?

> `optional` **currentDateTime**: `boolean`

Creates a tool for current date and time

### fullTextSearch?

> `optional` **fullTextSearch**: `boolean`

Creates tools to retrieve nodes via fulltext search of indexed properties

### getById?

> `optional` **getById**: `boolean`

Creates tools to retrieve nodes by id

### mergeNodesAndRelatioships?

> `optional` **mergeNodesAndRelatioships**: `boolean`

Creates tools that merges nodes and relationship to the graph

### similaritySearch?

> `optional` **similaritySearch**: `boolean`

Creates tools to retrieve nodes via similarity search of vector indexed properties

## Source

[types.ts:28](https://github.com/accordproject/lab-concerto-graph/blob/5d30e3cf29c8b84c4d23ee33ec8546f97f22bfdd/src/types.ts#L28)
