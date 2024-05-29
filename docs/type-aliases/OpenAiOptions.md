[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / OpenAiOptions

# Type alias: OpenAiOptions

> **OpenAiOptions**: `object`

Options used when calling Open AI

## Type declaration

### clientOptions?

> `optional` **clientOptions**: `ClientOptions`

Passed to the OpenAI client constructor

### embeddingModel?

> `optional` **embeddingModel**: `"text-embedding-3-small"`

Name of the embedding model to use

### model?

> `optional` **model**: `supportModelType`

Name of the model to use, defaults to OPENAI_MODEL

### temperature?

> `optional` **temperature**: `number`

Temperature to use

### tool\_choice?

> `optional` **tool\_choice**: `ChatCompletionToolChoiceOption`

Tool choice

## Source

[types.ts:49](https://github.com/accordproject/lab-concerto-graph/blob/3d5d649d27e9d0d9074fa504f52f930c3cf2ecbe/src/types.ts#L49)
