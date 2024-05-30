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

[types.ts:49](https://github.com/accordproject/lab-concerto-graph/blob/2b51c2d9858660c3c1b92d2eae736c7866fe4297/src/types.ts#L49)
