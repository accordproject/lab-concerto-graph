import * as crypto from 'crypto'
import OpenAI from "openai";
import { EMBEDDINGS_MAGIC, GraphModelOptions, PropertyBag, ToolResponse } from './types';
import { OPENAI_MODEL, OPENAI_TOOLS, TOOL_GET_EMBEDDINGS_NAME, getPrompt } from './prompt';
import { ChatCompletionMessageParam } from 'openai/resources';

/**
 * Computes the vector embeddings for a text string.
 * Uses the Open AI `text-embedding-3-small` model.
 * @param text the input text to compute embeddings for
 * @returns a promise to an array of numbers
 */
export async function getOpenAiEmbedding(text: string): Promise<Array<number>> {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
    });
    return response.data[0].embedding;
}

/**
 * Creates fake responses for evaluating the `get_embeddings` tool.
 * We concat all the query strings that need embeddings calculated and
 * we return the magic value `EMBEDDINGS_MAGIC` as the result of calling
 * the tool. We can then replace this magic value with the result of
 * calculating the embeddings. This is *much* faster than allowing Open AI
 * to handle the real tool-response (a large array of embeddings).
 * @param options GraphModel options
 * @param choice the current chat response
 * @returns the tool response, containing query string and new chat messages
 */
async function handleTools(options, choice: OpenAI.Chat.ChatCompletion.Choice) : Promise<ToolResponse | undefined> {
    if (!choice.message.tool_calls || !choice.message.tool_calls.length) {
        return;
    }
    const result:ToolResponse = {
        query: '', 
        messages: []
    };
    result.messages.push(choice.message);
    for (let n = 0; n < choice.message.tool_calls.length; n++) {
        const tool = choice.message.tool_calls[n];
        options.logger?.log(`Calling tool: ${tool.function.name}`);
        if (tool.function.name !== TOOL_GET_EMBEDDINGS_NAME) {
            options.logger?.log(`Unrecognized tool: ${tool.function.name}`);
        }
        const args = JSON.parse(tool.function.arguments);
        // if we have multiple tools calling get_embeddings
        // then we concat them each and return
        result.query = result.query.length > 0 ? result.query + ' ' + args.query : args.query;
        result.messages.push({ // the result of calling our tool...
            "role": "tool",
            "tool_call_id": tool.id,
            "content": EMBEDDINGS_MAGIC //JSON.stringify(embeddings)
        })
    }

    return result;
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
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let query = '';
    const runner = openai.beta.chat.completions
    .runTools({
        temperature: 0.05,
        tool_choice: "auto",
        model: OPENAI_MODEL,
        messages: [getPrompt(ctoModel, text)],
        tools: OPENAI_TOOLS
    })
    .on('functionCall', (functionCall) => {
        const args = JSON.parse(functionCall.arguments);
        query = query.length > 0 ? `${query} ${args.query}` : args.query;
    })

    const result = await runner.finalContent();
    // now we actually calling the embedding function and replace the EMBEDDINGS_MAGIC
    if (result && options.embeddingFunction && result.indexOf(EMBEDDINGS_MAGIC) > 0) {
        options.logger?.log(`Replacing embeddings: ${result} with embeddings for: '${query}'`);
        const embeddings = await options.embeddingFunction(query);
        return result.replaceAll(EMBEDDINGS_MAGIC, JSON.stringify(embeddings));
    }
    else {
        options.logger?.log('No EMBEDDINGS_MAGIC found.');
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