import OpenAI from 'openai';
import { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { CONVERSATION_PROMPT, OPENAI_MODEL } from "./prompt";
import { GraphModel } from "./graphmodel";
import { ConversationOptions } from './types';

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

    /**
     * Creates a new Conversation
     * @param graphModel the graph model for the conversation
     */
    constructor(graphModel: GraphModel, options:ConversationOptions) {
        this.graphModel = graphModel;
        this.tools = graphModel.getTools(options.toolOptions);
        this.client = new OpenAI();
        this.runner = null;
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
        return this.runner.finalContent();
    }
}