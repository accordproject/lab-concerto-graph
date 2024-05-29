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
    indexType: string;
    indexName: string;
}

/**
 * Options for tool generation from the model
 */
export type ToolOptions = {
    /**
     * Creates tools to retrieve nodes by id
     */
    getById?: boolean,
    /**
     * Creates tools to retrieve nodes via fulltext search of indexed properties
     */
    fullTextSearch?: boolean,
    /**
     * Creates tools to retrieve nodes via similarity search of vector indexed properties
     */
    similaritySearch?: boolean,
    /**
     * Creates tools to retrieve nodes via generation of Cypher from natural language
     */
    chatWithData?: boolean
}

/**
 * Options used when creating a Conversation
 */
export type ConversationOptions = {
    /**
     * Which tools to register on the conversation
     */
    toolOptions: ToolOptions

    /**
     * The maximum context size for the conversation. Old messages
     * will be automatically removed once the context size limit is
     * reached
     */
    maxContextSize?: number;

    /**
     * A logger to use for the Conversation
     */
    logger?: Logger;
}

/**
 * Definition of a full text index over some properties
 */
export type FullTextIndex = {
    type: string;
    properties: Array<string>;
    indexName: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (message?: any, ...optionalParams: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (message?: any, ...optionalParams: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    success: (message?: any, ...optionalParams: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (message?: any, ...optionalParams: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (message?: any, ...optionalParams: any[]) => void;
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