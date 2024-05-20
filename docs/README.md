**@accordproject/concerto-graph** • [**Docs**](globals.md)

***

# Concerto Graph

This project uses a [Concerto model](https://concerto.accordproject.org) to define the nodes and edges in a Neo4J graph database and uses the model to validate the properties on the nodes.

![demo](demo.png)
[Demo](src/demo/index.ts)

In a few lines of code you can define a Concerto data model validated graph and perform a vector similarity search over
nodes with text content.

Concerto model (snippet):

```
concept Movie extends GraphNode {
  @vector_index("summary", 1536, "COSINE")
  o Double[] embedding optional
  @embedding
  o String summary optional
  @label("IN_GENRE")
  --> Genre[] genres optional
}
```

TypeScript code:

```typescript
    await graphModel.mergeNode(transaction, `${NS}.Movie`, {identifier: 'Brazil', summary: 'The film centres on Sam Lowry, a low-ranking bureaucrat trying to find a woman who appears in his dreams while he is working in a mind-numbing job and living in a small apartment, set in a dystopian world in which there is an over-reliance on poorly maintained (and rather whimsical) machines'} );
    
    await graphModel.mergeNode(transaction, `${NS}.Genre`, {identifier: 'Comedy'} );
    
    await graphModel.mergeRelationship(transaction, `${NS}.Movie`, 'Brazil', `${NS}.Genre`, 'Comedy', 'genres' );
    
    await graphModel.mergeNode(transaction, `${NS}.Director`, {identifier: 'Terry Gilliam'} );
    await graphModel.mergeRelationship(transaction, `${NS}.Director`, 'Terry Gilliam', `${NS}.Movie`, 'Brazil', 'directed' );
    
    await graphModel.mergeNode(transaction, `${NS}.Actor`, {identifier: 'Jonathan Pryce'} );
    await graphModel.mergeRelationship(transaction, `${NS}.Actor`, 'Jonathan Pryce', `${NS}.Movie`, 'Brazil', 'actedIn' );
    
    const search = 'Working in a boring job and looking for love.';
    const results = await graphModel.similarityQuery(`${NS}.Movie`, 'embedding', search, 3);
```

Runtime result:

```json
[
  {
    identifier: 'Brazil',
    content: 'The film centres on Sam Lowry, a low-ranking bureaucrat trying to find a woman who appears in his dreams while he is working in a mind-numbing job and living in a small apartment, set in a dystopian world in which there is an over-reliance on poorly maintained (and rather whimsical) machines',
    score: 0.901830792427063
  }
]
```

## Environment Variables

### GraphDB

- NEO4J_URL: the NEO4J URL. E.g. `neo4j+s://<DB_NAME>.databases.neo4j.io` if you are using AuraDB.
- NEO4J_PASS: your neo4j password.
- NEO4J_USER: <optional> defaults to `neo4j`

### Text Embeddings
- OPENAI_API_KEY: <optional> the OpenAI API key. If not set embeddings are not computed and written to the agreement graph and similarity search, natural language to Cypher generation ("chat with data") is not possible.
