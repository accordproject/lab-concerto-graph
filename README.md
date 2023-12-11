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

## Environment Variables

### GraphDB

- NEO4J_URL: <optional> the NEO4J URL. If not set, no data will be written to the agreement graph.
- NEO4J_PASS: <optional> the neo4j password. 
- NEO4J_ENCRYPTED: <optional> whether the neo4j connection is encrypted
- NEO4J_LOGGING: <optional> when set logs neo4j statements to console

### Text Embeddings
- OPENAI_API_KEY: <optional> the OpenAI API key. If not set embeddings are not computed and written to the agreement graph.