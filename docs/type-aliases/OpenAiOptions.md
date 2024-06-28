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

[types.ts:54](https://github.com/accordproject/lab-concerto-graph/blob/7906621d6d0601d49217ffdd5ad64cfc20af0507/src/types.ts#L54)
