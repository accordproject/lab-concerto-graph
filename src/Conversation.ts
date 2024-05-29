import OpenAI from 'openai';
import { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { CONVERSATION_PROMPT, OPENAI_MODEL } from "./prompt";
import { GraphModel } from "./graphmodel";
import { ConversationOptions } from './types';
import { GPTTokens } from 'gpt-tokens';

/**
 * An LLM conversation about a GraphModel
 */
export class Conversation {
    graphModel: GraphModel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools:Array<RunnableToolFunction<any>>;

    messages;
    client;
    runner;
    options:ConversationOptions;

    /**
     * Creates a new Conversation
     * @param graphModel the graph model for the conversation
     */
    constructor(graphModel: GraphModel, options:ConversationOptions) {
        this.graphModel = graphModel;
        this.tools = graphModel.getTools(options.toolOptions);
        this.client = new OpenAI();
        this.runner = null;
        this.options = options;
    }

    /**
     * Adds a user message to a conversation that uses the
     * graph model as a tool(s)
     * @param content the user message to add to the conversation
     * @returns the final result message
     */
    async appendUserMessage(content:string) {
        if(!this.runner) {
            this.runner = this.client.beta.chat.completions
            .runTools({
                model: OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: CONVERSATION_PROMPT,
                    },
                    { role: 'user', content }
                ],
                tools: this.tools
            });
        }
        else {
            const messages = this.runner.messages.concat([{ role: 'user', content }]);
            this.runner = this.client.beta.chat.completions.runTools({
                model: OPENAI_MODEL,
                messages,
                tools: this.tools
            });    
        }
        const result = await this.runner.finalContent();
        if(this.options.maxContextSize) {
            let used = this.getUsedTokens();
            while(used?.usedTokens && used?.usedTokens > this.options.maxContextSize) {
                this.runner.messages.splice(1,1); // remove the second element, so we leave the system message
                this.options.logger?.info(`Trimmed conversation history, used: ${used?.usedTokens}`);
                used = this.getUsedTokens();
            }
        }
        return result;
    }

    /**
     * Returns the used tokens for the conversation
     * @returns the used tokens for the conversation messages
     * or undefined if a user message has not been added
     */
    getUsedTokens() : GPTTokens | undefined {
        if(this.runner && this.runner.messages && this.runner.messages.length > 1) {
            return new GPTTokens({
                model   : OPENAI_MODEL,
                messages: this.runner.messages,
            })    
        }
    }
}