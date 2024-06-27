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

[types.ts:54](https://github.com/accordproject/lab-concerto-graph/blob/f4094bbe0ab316e66d660c108a0dc8a69f47e2df/src/types.ts#L54)
