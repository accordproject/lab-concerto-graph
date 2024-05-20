[**@accordproject/concerto-graph**](../README.md) • **Docs**

***

[@accordproject/concerto-graph](../README.md) / ROOT\_MODEL

# Variable: ROOT\_MODEL

> `const` **ROOT\_MODEL**: "namespace org.accordproject.graph@1.0.0\nconcept GraphNode identified by identifier \{\n    o String identifier\n\}\nconcept EmbeddingCacheNode extends GraphNode \{\n    o Double\[\] embedding\n    @vector\_index(\"embedding\", 1536, \"COSINE\")\n    o String content  \n\}\n"

The concerto graph model, defines internal nodes

## Source

[graphmodel.ts:225](https://github.com/accordproject/lab-concerto-graph/blob/0563543f1fdc8f8f027cd4b4eb91d11b07eff3b4/src/graphmodel.ts#L225)
