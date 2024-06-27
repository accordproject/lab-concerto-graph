import { ChatCompletionSystemMessageParam } from "openai/resources";
import { EMBEDDINGS_MAGIC } from "./types";
import { RunnableToolFunction } from "openai/lib/RunnableFunction";

export function getTextToGraphPrompt(textToGraphPrompt:string, ctoModel:string, text:string) : ChatCompletionSystemMessageParam {
    return {
        role: 'system',
        content: `You are an expert assistant that converts natural language text into a knowlege graph.

${textToGraphPrompt}

A knowledge graph is composed of nodes, with relationships between the nodes. Nodes have a label and a set of properties.
The structure of the nodes and relationships that you output must conform to a schema defined by an Accord Project Concerto model. 
Here is the Concerto model you must use:

\`\`\`
${ctoModel}
\`\`\`

To create a node you output a JSON object of the form: {"type" : "node", "label" : "Person", "properties" : <PROPS>} where PROPS are the properties of the Person node.
To create a relationship you output a JSON object of the form: {"type" : "relationship", "startNodeLabel" : "Actor", "startNodeIdentifier" : "Johnny Depp", "endNodeLabel": "Movie", "endNodeIdentifier" : "Fear and Loathing in Las Vegas", "startNodePropertyName" : "actedIn" }.

Convert the following natural language to a JSON object with an 'elements' property that is an array of nodes and relationships: """${text}
"""
`}
}

export function getTextToCypherPrompt(ctoModel:string, text:string) : ChatCompletionSystemMessageParam {
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

Here is an example Neo4J Cypher query that matches 3 movies summaries by conceptual similarity 
(using vector cosine similarity):
\`\`\`
MATCH (l:Movie)
    CALL db.index.vector.queryNodes('movie_summary', 10, ${EMBEDDINGS_MAGIC} )
    YIELD node AS similar1, score
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

export const CONVERSATION_PROMPT = `Please use our knowledge graph, which you can access using tools to answer the following questions. 
Query the knowledge graph using the 'chat_with_data' tool before trying other tools.`;

export const TEXT_TO_GRAPH_PROMPT = 'Please create nodes and relationships in our knowlege graph, which you can access using tools.';

export const OPENAI_MODEL = 'gpt-4o';

export const TOOL_GET_EMBEDDINGS_NAME = "get_embeddings";
export const TOOL_CREATE_NODE_NAME = "create_graph_node";
export const TOOL_CREATE_EDGE_NAME = "create_graph_edge";

/**
 * This defines an OpenAI tool that can be used
 * to by the LLM when vector embeddings are required for
 * a string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TEXT_TO_CYPHER_TOOLS:Array<RunnableToolFunction<any>> = [
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