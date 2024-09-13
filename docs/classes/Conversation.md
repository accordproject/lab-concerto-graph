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

[Conversation.ts:28](https://github.com/accordproject/lab-concerto-graph/blob/3eb3c9ab7fe3c9ea43c73c34d265e10ae6cb03b0/src/Conversation.ts#L28)

## Properties

| Property | Type |
| :------ | :------ |
| `client` | `OpenAI` |
| `graphModel` | [`GraphModel`](GraphModel.md) |
| `messages` | `any` |
| `options` | [`ConversationOptions`](../type-aliases/ConversationOptions.md) |
| `runner` | `null` \| `ChatCompletionRunner` |
| `tools` | `RunnableToolFunction`\<`any`\>[] |

## Methods

### appendUserMessage()

> **appendUserMessage**(`content`): `Promise`\<`null` \| `string`\>

Adds a user message to a conversation that uses the
graph model as a tool(s)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | the user message to add to the conversation |

#### Returns

`Promise`\<`null` \| `string`\>

the final result message

#### Source

[Conversation.ts:83](https://github.com/accordproject/lab-concerto-graph/blob/3eb3c9ab7fe3c9ea43c73c34d265e10ae6cb03b0/src/Conversation.ts#L83)

***

### getSystemMessage()

> **getSystemMessage**(): `ChatCompletionSystemMessageParam`

The system message

#### Returns

`ChatCompletionSystemMessageParam`

the system message for the conversation

#### Source

[Conversation.ts:70](https://github.com/accordproject/lab-concerto-graph/blob/3eb3c9ab7fe3c9ea43c73c34d265e10ae6cb03b0/src/Conversation.ts#L70)

***

### getUsedTokens()

> **getUsedTokens**(): `undefined` \| `GPTTokens`

Returns the used tokens for the conversation

#### Returns

`undefined` \| `GPTTokens`

the used tokens for the conversation messages
or undefined if a user message has not been added

#### Source

[Conversation.ts:113](https://github.com/accordproject/lab-concerto-graph/blob/3eb3c9ab7fe3c9ea43c73c34d265e10ae6cb03b0/src/Conversation.ts#L113)

***

### runMessages()

> **runMessages**(`messages`, `content`): `Promise`\<`ChatCompletionMessageParam`[]\>

Reinitializes the messages, adds a user messages and runs
to completion. Used for stateless execution.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `messages` | `any` | the existing messages |
| `content` | `string` | the user message to add to the conversation |

#### Returns

`Promise`\<`ChatCompletionMessageParam`[]\>

all the messages

#### Source

[Conversation.ts:43](https://github.com/accordproject/lab-concerto-graph/blob/3eb3c9ab7fe3c9ea43c73c34d265e10ae6cb03b0/src/Conversation.ts#L43)
