---
title: Concerto Graph
description: Store Concerto Concepts in a Graph DB
tags:
  - Concerto
  - Neo4J
  - Graph
---

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

You can also "chat with your data" — converting natural language queries to Neo4J Cypher
queries and running them over your graph.

```
    const chat = 'Which director has directed both Johnny Depp and Jonathan Pryce, but not necessarily in the same movie?';
    console.log(`Chat with data: ${chat}`);
    const cypher = await graphModel.textToCypher(chat);
    console.log(`Converted to Cypher query: ${cypher}`);    
    const chatResult = await graphModel.chatWithData(chat);
    console.log(JSON.stringify(chatResult, null, 2));
```

Output:

```
Chat with data: Which director has directed both Johnny Depp and Jonathan Pryce, but not necessarily in the same movie?
Converted to Cypher query: MATCH (d:Director)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a1:Actor {identifier: 'Johnny Depp'}),
      (d)-[:DIRECTED]->(m2:Movie)<-[:ACTED_IN]-(a2:Actor {identifier: 'Jonathan Pryce'})
RETURN d.identifier
[
  {
    "d.identifier": "Terry Gilliam"
  },
  {
    "d.identifier": "Terry Gilliam"
  }
]
```
 
 Natural language queries can even contain expressions that use the conceptual search (vector similarity)!

 ```
    const search = 'working in a boring job and looking for love.';
    const chat2 = `Which director has directed a movie that is about the concepts of ${search}? Return a single movie.`;
    const chatResult2 = await graphModel.chatWithData(chat2);
    console.log(JSON.stringify(chatResult2, null, 2));
```

Output:

```
Calling tool: get_embeddings
Tool replacing embeddings: MATCH (d:Director)-[:DIRECTED]->(m:Movie)
CALL db.index.vector.queryNodes('movie_summary', 1, <EMBEDDINGS>)
YIELD node AS similar, score
MATCH (similar)<-[:DIRECTED]-(d)
RETURN d.identifier as director, similar.identifier as movie, similar.summary as summary, score limit 1
[
  {
    "director": "Terry Gilliam",
    "movie": "Brazil",
    "summary": "The film centres on Sam Lowry, a low-ranking bureaucrat trying to find a woman who appears in his dreams while he is working in a mind-numbing job and living in a small apartment, set in a dystopian world in which there is an over-reliance on poorly maintained (and rather whimsical) machines",
    "score": 0.7065110206604004
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

## API Documentation

API documentation is available [here](./docs/README.md).