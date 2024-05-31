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

### fullTextSearch?

> `optional` **fullTextSearch**: `boolean`

Creates tools to retrieve nodes via fulltext search of indexed properties

### getById?

> `optional` **getById**: `boolean`

Creates tools to retrieve nodes by id

### similaritySearch?

> `optional` **similaritySearch**: `boolean`

Creates tools to retrieve nodes via similarity search of vector indexed properties

## Source

[types.ts:27](https://github.com/accordproject/lab-concerto-graph/blob/bea41ec87924201b9fbf2eb7e09102b1acce5799/src/types.ts#L27)
