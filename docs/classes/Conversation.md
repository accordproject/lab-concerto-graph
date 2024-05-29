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

[Conversation.ts:25](https://github.com/accordproject/lab-concerto-graph/blob/3060b0365eb0e289450a7d39202b9f90093326a0/src/Conversation.ts#L25)

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

[Conversation.ts:39](https://github.com/accordproject/lab-concerto-graph/blob/3060b0365eb0e289450a7d39202b9f90093326a0/src/Conversation.ts#L39)

***

### getUsedTokens()

> **getUsedTokens**(): `undefined` \| `GPTTokens`

Returns the used tokens for the conversation

#### Returns

`undefined` \| `GPTTokens`

the used tokens for the conversation messages
or undefined if a user message has not been added

#### Source

[Conversation.ts:79](https://github.com/accordproject/lab-concerto-graph/blob/3060b0365eb0e289450a7d39202b9f90093326a0/src/Conversation.ts#L79)
