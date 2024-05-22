[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / Conversation

# Class: Conversation

An LLM conversation about a GraphModel

## Constructors

### new Conversation()

> **new Conversation**(`graphModel`): [`Conversation`](Conversation.md)

Creates a new Conversation

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `graphModel` | [`GraphModel`](GraphModel.md) | the graph model for the conversation |

#### Returns

[`Conversation`](Conversation.md)

#### Source

[Conversation.ts:22](https://github.com/accordproject/lab-concerto-graph/blob/7f61653e6520d7e542d820dd570316a83b59870d/src/Conversation.ts#L22)

## Properties

| Property | Type |
| :------ | :------ |
| `client` | `any` |
| `graphModel` | [`GraphModel`](GraphModel.md) |
| `messages` | `any` |
| `runner` | `any` |
| `tools` | `RunnableToolFunction`\<`any`\>[] |

## Methods

### appendUserMessage()

> **appendUserMessage**(`content`): `Promise`\<`any`\>

Adds a user message to a conversation that uses the
graph model as a tool(s)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | the user message to add to the conversation |

#### Returns

`Promise`\<`any`\>

the final result message

#### Source

[Conversation.ts:35](https://github.com/accordproject/lab-concerto-graph/blob/7f61653e6520d7e542d820dd570316a83b59870d/src/Conversation.ts#L35)
