[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / Conversation

# Class: Conversation

An LLM conversation about a GraphModel

## Constructors

### new Conversation()

> **new Conversation**(`graphModel`, `options`): [`Conversation`](Conversation.md)

Creates a new Conversation

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `graphModel` | [`GraphModel`](GraphModel.md) | the graph model for the conversation |
| `options` | [`ConversationOptions`](../type-aliases/ConversationOptions.md) | - |

#### Returns

[`Conversation`](Conversation.md)

#### Source

[Conversation.ts:23](https://github.com/accordproject/lab-concerto-graph/blob/d465c4dc872d480e4c8d94031fef52df36ff5b77/src/Conversation.ts#L23)

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

[Conversation.ts:36](https://github.com/accordproject/lab-concerto-graph/blob/d465c4dc872d480e4c8d94031fef52df36ff5b77/src/Conversation.ts#L36)
