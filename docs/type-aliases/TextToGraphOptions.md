[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / TextToGraphOptions

# Type alias: TextToGraphOptions

> **TextToGraphOptions**: `object`

Options used when creating a TextToGraph

## Type declaration

### logger?

> `optional` **logger**: [`Logger`](Logger.md)

A logger to use for the Conversation

### maxContextSize?

> `optional` **maxContextSize**: `number`

The maximum context size for the conversation. Old messages
will be automatically removed once the context size limit is
reached

### openAiOptions?

> `optional` **openAiOptions**: [`OpenAiOptions`](OpenAiOptions.md)

Options to configure Open AI

### textToGraphPrompt?

> `optional` **textToGraphPrompt**: `string`

An optional prompt to further guide conversion of text to graph

## Source

[types.ts:119](https://github.com/accordproject/lab-concerto-graph/blob/3eb3c9ab7fe3c9ea43c73c34d265e10ae6cb03b0/src/types.ts#L119)
