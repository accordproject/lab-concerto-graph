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

### mergeNodesAndRelationships?

> `optional` **mergeNodesAndRelationships**: `boolean`

Creates tools that merges nodes and relationship to the graph

### similaritySearch?

> `optional` **similaritySearch**: `boolean`

Creates tools to retrieve nodes via similarity search of vector indexed properties

## Source

[types.ts:28](https://github.com/accordproject/lab-concerto-graph/blob/3eb3c9ab7fe3c9ea43c73c34d265e10ae6cb03b0/src/types.ts#L28)
