import { Session } from 'neo4j-driver';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

/**
 * A constant that is used in Open AI prompt
 * to improve the performance of generating Cypher queries
 * that include semantic embeddings
 */
export const EMBEDDINGS_MAGIC = '<EMBEDDINGS>';

/**
 * Definition of a vector (embeddings) index
 */
export type VectorIndex = {
    property: string;
    size: number;
    type: string;
}

/**
 * Definition of a full text index over some properties
 */
export type FullTextIndex = {
    properties: Array<string>;
}

/**
 * Runtime context
 */
export type Context = {
    session: Session;
}

/**
 * A Node type that is used to cache vector embeddings
 */
export type EmbeddingCacheNode = {
    $class: string;
    embedding: Array<number>;
    content: string;
}

/**
 * Result of a vector similarity search
 */
export type SimilarityResult = {
    identifier: string;
    content: string;
    score: number;
}

/**
 * A untyped set of properties
 */
export type PropertyBag = Record<string, unknown>;

/**
 * The properties allowed on graph nodes
 */
export type GraphNodeProperties = PropertyBag;

/**
 * Function signature for a function that can calculate
 * vector embeddings for text
 */
export type EmbeddingFunction = (text: string) => Promise<Array<number>>;

/**
 * Function signature for a logger
 */
export type Logger = {
    log: (text: string) => void;
}

/**
 * Graph model options, used to configure Concerto Graph
 */
export type GraphModelOptions = {
    embeddingFunction?: EmbeddingFunction;
    logger?: Logger;
    NEO4J_URL?: string;
    NEO4J_USER?: string;
    NEO4J_PASS?: string;
    logQueries?: boolean;
}

/**
 * Defines the response from evaluating the embedding tool
 */
export type ToolResponse = {
    /**
     * The string that we should compute embedding vectors for
     */
    query: string,

    /**
     * The tool response messages that need to be added to the chat
     */
    messages: Array<ChatCompletionMessageParam>
}