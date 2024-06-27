import * as crypto from 'crypto'
import OpenAI from "openai";
import { EMBEDDINGS_MAGIC, GraphModelOptions, OpenAiOptions, PropertyBag } from './types';
import { OPENAI_MODEL, TEXT_TO_CYPHER_TOOLS, getTextToCypherPrompt } from './prompt';

export function toOpenAiToolType(type:string) {
    switch(type) {
        case 'DateTime':
        case 'String':
            return 'string'
        case 'Integer':
        case 'Long':
        case 'Double':
            return 'number'
        case 'Boolean':
            return 'boolean'
        default: 
            return undefined // 'object';
    }
}

/**
 * Computes the vector embeddings for a text string.
 * Uses the Open AI `text-embedding-3-small` model.
 * @param text the input text to compute embeddings for
 * @returns a promise to an array of numbers
 */
export async function getOpenAiEmbedding(options:OpenAiOptions|undefined, text: string): Promise<Array<number>> {
    const openai = new OpenAI(options?.clientOptions);
    const response = await openai.embeddings.create({
        model: options?.embeddingModel ?? 'text-embedding-3-small',
        input: text,
        encoding_format: "float",
    });
    return response.data[0].embedding;
}

/**
 * Converts a natural language query string to a Neo4J Cypher query.
 * @param options configure logger and embedding function
 * @param text the input text to convert to Cypher
 * @param ctoModel the text of all CTO models, used to configure Cypher generation
 * @returns a promise to the Cypher query or null
 */
export async function textToCypher(options: GraphModelOptions, text: string, ctoModel): Promise<string | null> {
    // set up our call to Open AI, including our tools
    const openai = new OpenAI(options.openAiOptions?.clientOptions);
    let query = '';
    const runner = openai.beta.chat.completions
    .runTools({
        temperature: options.openAiOptions?.temperature ?? 0.05,
        tool_choice: options.openAiOptions?.tool_choice ?? 'auto',
        // tool_choice: {type: 'function', function: {name: TOOL_GET_EMBEDDINGS_NAME}},
        model: options.openAiOptions?.model ?? OPENAI_MODEL,
        messages: [getTextToCypherPrompt(ctoModel, text)],
        tools: TEXT_TO_CYPHER_TOOLS
    })
    .on('functionCall', (functionCall) => {
        const args = JSON.parse(functionCall.arguments);
        query = query.length > 0 ? `${query} ${args.query}` : args.query;
    })

    const result = await runner.finalContent();
    // now we actually calling the embedding function and replace the EMBEDDINGS_MAGIC
    if (result && options.embeddingFunction && result.indexOf(EMBEDDINGS_MAGIC) > 0) {
        options.logger?.info(`Generated Cypher: ${result} with embeddings for: '${query}'`);
        const embeddings = await options.embeddingFunction(options.openAiOptions, query);
        return result.replaceAll(EMBEDDINGS_MAGIC, JSON.stringify(embeddings));
    }
    else {
        options.logger?.info('No EMBEDDINGS_MAGIC found.');
    }
    return result;
}

/**
 * Computes a deterministic identifier for a set of properties.
 * @param obj the properties of an object
 * @returns the identifier as a string
 */
export function getObjectChecksum(obj: PropertyBag) {
    const deterministicReplacer = (_, v) =>
        typeof v !== 'object' || v === null || Array.isArray(v) ? v :
            Object.fromEntries(Object.entries(v).sort(([ka], [kb]) =>
                ka < kb ? -1 : ka > kb ? 1 : 0));
    return crypto.createHash('sha256').update(JSON.stringify(obj, deterministicReplacer)).digest('hex')
}

/**
 * Computes a SHA256 checksum for input text
 * @param text the input text
 * @returns the checksum
 */
export function getTextChecksum(text: string) {
    return crypto.createHash('sha256').update(text).digest('hex')
}