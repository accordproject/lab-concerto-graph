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
| `options` | [`ConversationOptions`](../type-aliases/ConversationOptions.md) | the options for the conversation |

#### Returns

[`Conversation`](Conversation.md)

#### Source

[Conversation.ts:26](https://github.com/accordproject/lab-concerto-graph/blob/3d5d649d27e9d0d9074fa504f52f930c3cf2ecbe/src/Conversation.ts#L26)

## Properties

| Property | Type |
| :------ | :------ |
| `client` | `any` |
| `graphModel` | [`GraphModel`](GraphModel.md) |
| `messages` | `any` |
| `options` | [`ConversationOptions`](../type-aliases/ConversationOptions.md) |
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

[Conversation.ts:40](https://github.com/accordproject/lab-concerto-graph/blob/3d5d649d27e9d0d9074fa504f52f930c3cf2ecbe/src/Conversation.ts#L40)

***

### getUsedTokens()

> **getUsedTokens**(): `undefined` \| `GPTTokens`

Returns the used tokens for the conversation

#### Returns

`undefined` \| `GPTTokens`

the used tokens for the conversation messages
or undefined if a user message has not been added

#### Source

[Conversation.ts:80](https://github.com/accordproject/lab-concerto-graph/blob/3d5d649d27e9d0d9074fa504f52f930c3cf2ecbe/src/Conversation.ts#L80)
