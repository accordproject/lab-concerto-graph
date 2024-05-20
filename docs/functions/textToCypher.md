[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / textToCypher

# Function: textToCypher()

> **textToCypher**(`options`, `text`, `ctoModel`): `Promise`\<`string` \| `null`\>

Converts a natural language query string to a Neo4J Cypher query.

## Parameters

• **options**: [`GraphModelOptions`](../type-aliases/GraphModelOptions.md)

configure logger and embedding function

• **text**: `string`

the input text to convert to Cypher

• **ctoModel**: `any`

the text of all CTO models, used to configure Cypher generation

## Returns

`Promise`\<`string` \| `null`\>

a promise to the Cypher query or null

## Source

[graphmodel.ts:70](https://github.com/accordproject/lab-concerto-graph/blob/7f2e9294ea86dce21442f2458a6ff685a4437085/src/graphmodel.ts#L70)
