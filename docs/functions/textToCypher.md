[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../globals.md) / textToCypher

# Function: textToCypher()

> **textToCypher**(`options`, `text`, `ctoModel`): `Promise`\<`string` \| `null`\>

Converts a natural language query string to a Neo4J Cypher query.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | [`GraphModelOptions`](../type-aliases/GraphModelOptions.md) | configure logger and embedding function |
| `text` | `string` | the input text to convert to Cypher |
| `ctoModel` | `any` | the text of all CTO models, used to configure Cypher generation |

## Returns

`Promise`\<`string` \| `null`\>

a promise to the Cypher query or null

## Source

[graphmodel.ts:70](https://github.com/accordproject/lab-concerto-graph/blob/cefc9be4fd1dac498d9d3b8abf33d069293dcc53/src/graphmodel.ts#L70)
