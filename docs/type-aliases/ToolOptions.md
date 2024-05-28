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

[types.ts:25](https://github.com/accordproject/lab-concerto-graph/blob/4f9bc9d221981b215096d0e5223994bc8c2351f5/src/types.ts#L25)
