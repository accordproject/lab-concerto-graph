[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / getOpenAiEmbedding

# Function: getOpenAiEmbedding()

> **getOpenAiEmbedding**(`options`, `text`): `Promise`\<`number`[]\>

Computes the vector embeddings for a text string.
Uses the Open AI `text-embedding-3-small` model.

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `options` | `undefined` \| [`OpenAiOptions`](../type-aliases/OpenAiOptions.md) | - |
| `text` | `string` | the input text to compute embeddings for |

## Returns

`Promise`\<`number`[]\>

a promise to an array of numbers

## Source

[functions.ts:28](https://github.com/accordproject/lab-concerto-graph/blob/87c81018347fa08584f3cb9907a3e77815e8c62a/src/functions.ts#L28)
