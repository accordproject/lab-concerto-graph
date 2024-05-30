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

[types.ts:49](https://github.com/accordproject/lab-concerto-graph/blob/f35b2c83def67024267ebc86c933947c7d1a0f62/src/types.ts#L49)
