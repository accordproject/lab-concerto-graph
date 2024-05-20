[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / getOpenAiEmbedding

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

[graphmodel.ts:53](https://github.com/accordproject/lab-concerto-graph/blob/2c80b4a9bb941195f795971845a6802f68fb0254/src/graphmodel.ts#L53)
