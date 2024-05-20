[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../globals.md) / getOpenAiEmbedding

# Function: getOpenAiEmbedding()

> **getOpenAiEmbedding**(`text`): `Promise`\<`number`[]\>

Computes the vector embeddings for a text string.
Uses the Open AI `text-embedding-3-small` model.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the input text to compute embeddings for |

## Returns

`Promise`\<`number`[]\>

a promise to an array of numbers

## Source

[graphmodel.ts:53](https://github.com/accordproject/lab-concerto-graph/blob/cefc9be4fd1dac498d9d3b8abf33d069293dcc53/src/graphmodel.ts#L53)
