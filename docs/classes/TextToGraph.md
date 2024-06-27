[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / TextToGraph

# Class: TextToGraph

Converts natural language text to Graph Nodes and merges them
into the knowlege graph.

## Constructors

### new TextToGraph()

> **new TextToGraph**(`graphModel`, `options`): [`TextToGraph`](TextToGraph.md)

Creates a new TextToGraph

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `graphModel` | [`GraphModel`](GraphModel.md) | the graph model |
| `options` | [`TextToGraphOptions`](../type-aliases/TextToGraphOptions.md) | the options for the text to graph conversion |

#### Returns

[`TextToGraph`](TextToGraph.md)

#### Source

[TextToGraph.ts:19](https://github.com/accordproject/lab-concerto-graph/blob/87c81018347fa08584f3cb9907a3e77815e8c62a/src/TextToGraph.ts#L19)

## Properties

| Property | Type |
| :------ | :------ |
| `conversation` | [`Conversation`](Conversation.md) |
| `options` | [`TextToGraphOptions`](../type-aliases/TextToGraphOptions.md) |

## Methods

### mergeText()

> **mergeText**(`text`): `Promise`\<`object`\>

Converts text to graph nodes and relationships and adds them to the knowlege graph

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the text to extract nodes and relationships from |

#### Returns

`Promise`\<`object`\>

an object that describes which nodes and relationships were added

##### nodes

> **nodes**: `string`[]

##### relationships

> **relationships**: `string`[]

#### Source

[TextToGraph.ts:35](https://github.com/accordproject/lab-concerto-graph/blob/87c81018347fa08584f3cb9907a3e77815e8c62a/src/TextToGraph.ts#L35)
