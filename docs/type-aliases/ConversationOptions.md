[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / ConversationOptions

# Type alias: ConversationOptions

> **ConversationOptions**: `object`

Options used when creating a Conversation

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

### systemPrompt?

> `optional` **systemPrompt**: `string`

System prompt

### toolOptions

> **toolOptions**: [`ToolOptions`](ToolOptions.md)

Which tools to register on the conversation

## Source

[types.ts:88](https://github.com/accordproject/lab-concerto-graph/blob/5d30e3cf29c8b84c4d23ee33ec8546f97f22bfdd/src/types.ts#L88)
