[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / textToCypher

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

[graphmodel.ts:70](https://github.com/accordproject/lab-concerto-graph/blob/2c80b4a9bb941195f795971845a6802f68fb0254/src/graphmodel.ts#L70)
