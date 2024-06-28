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

[Conversation.ts:26](https://github.com/accordproject/lab-concerto-graph/blob/91648e75986670e16261bbc19c4f75e2a4f3c3b8/src/Conversation.ts#L26)

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

[Conversation.ts:81](https://github.com/accordproject/lab-concerto-graph/blob/91648e75986670e16261bbc19c4f75e2a4f3c3b8/src/Conversation.ts#L81)

***

### getSystemMessage()

> **getSystemMessage**(): `object`

The system message

#### Returns

`object`

the system message for the conversation

##### content

> **content**: `string`

##### role

> **role**: `string` = `'system'`

#### Source

[Conversation.ts:68](https://github.com/accordproject/lab-concerto-graph/blob/91648e75986670e16261bbc19c4f75e2a4f3c3b8/src/Conversation.ts#L68)

***

### getUsedTokens()

> **getUsedTokens**(): `undefined` \| `GPTTokens`

Returns the used tokens for the conversation

#### Returns

`undefined` \| `GPTTokens`

the used tokens for the conversation messages
or undefined if a user message has not been added

#### Source

[Conversation.ts:111](https://github.com/accordproject/lab-concerto-graph/blob/91648e75986670e16261bbc19c4f75e2a4f3c3b8/src/Conversation.ts#L111)

***

### runMessages()

> **runMessages**(`messages`, `content`): `Promise`\<`any`\>

Reinitializes the messages, adds a user messages and runs
to completion. Used for stateless execution.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `messages` | `any` | the existing messages |
| `content` | `string` | the user message to add to the conversation |

#### Returns

`Promise`\<`any`\>

all the messages

#### Source

[Conversation.ts:41](https://github.com/accordproject/lab-concerto-graph/blob/91648e75986670e16261bbc19c4f75e2a4f3c3b8/src/Conversation.ts#L41)
