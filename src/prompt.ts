import { ChatCompletionSystemMessageParam } from "openai/resources";
import { EMBEDDINGS_MAGIC } from "./types";
import { RunnableToolFunction } from "openai/lib/RunnableFunction";

export function getPrompt(ctoModel:string, text:string) : ChatCompletionSystemMessageParam {
    return {
        role: 'system',
        content: `Convert the natural language query delimited by triple quotes to a Neo4J Cypher query.
Just return the Cypher query, without an explanation for how it works.

The nodes and edges in Neo4j are described by the following Accord Project Concerto model:
\`\`\`
${ctoModel}
\`\`\`

Concerto properties with the @vector_index decorator have a Neo4J vector index. The name
of the vector index is the lowercase name of the declaration with '_' and the lowercase 
name of the property appended. 
For example: 'movie_summary' is the name of the vector index for the 'Movie.summary' property.

Concerto declarations with any properties with the @fulltext_index decorator have a 
full text index. The name of the full text index is the lowercase name of the declaration
with '_fulltext' appended.
For example: movie_fulltext is the name of the full text index for the 'Movie' declaration.

Use the token ${EMBEDDINGS_MAGIC} to denote the embedding vector for input text.

Here is an example Neo4J Cypher query that matches 3 movies by conceptual similarity 
(using vector cosine similarity):
\`\`\`
MATCH (l:Movie)
    CALL db.index.vector.queryNodes('movie_summary', 10, ${EMBEDDINGS_MAGIC} )
    YIELD node AS similar, score
    MATCH (similar)
    RETURN similar.identifier as identifier, similar.summary as content, score limit 3
\`\`\`

Use 10 as the second argument to db.index.vector.queryNodes.

Here is an example  Neo4J Cypher query that finds the shortest path between two people 'Dan Selman' and 'Ann Selman':
\`\`\`
MATCH
  (a:Person {identifier: 'Dan Selman'}),
  (b:Person {identifier: 'Ann Selman'}),
  p = shortestPath((a)-[:RELATED_TO*]-(b))
RETURN p
\`\`\`

Convert the following natural language query to Neo4J Cypher: """${text}
"""
Do not enclose the result in a markdown code block.
`}
}

export const CONVERSATION_PROMPT = `Please use our database, which you can access using functions to answer the following questions. 
Favor using the 'chat_with_data' tool over Fulltext search of Similarity search tools.`;

export const OPENAI_MODEL = 'gpt-4o';

export const TOOL_GET_EMBEDDINGS_NAME = "get_embeddings";

/**
 * This defines an OpenAI tool that can be used
 * to by the LLM when vector embeddings are required for
 * a string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OPENAI_TOOLS:Array<RunnableToolFunction<any>> = [
    {
        type: "function",
        function: {
            name: TOOL_GET_EMBEDDINGS_NAME,
            description: "Get semantic/conceptual vector embeddings for a query string",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            function: ((args: { query: string }) => {
                return EMBEDDINGS_MAGIC;
            }),
            parse: JSON.parse,
            parameters: {
                type: "object",
                properties: {
                    query: {
                        "type": "string",
                    }
                },
                required: ["query"]
            }
        }
    }
];