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

### toolOptions

> **toolOptions**: [`ToolOptions`](ToolOptions.md)

Which tools to register on the conversation

## Source

[types.ts:79](https://github.com/accordproject/lab-concerto-graph/blob/3d5d649d27e9d0d9074fa504f52f930c3cf2ecbe/src/types.ts#L79)
