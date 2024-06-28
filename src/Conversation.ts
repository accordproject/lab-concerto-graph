import OpenAI from 'openai';
import { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { CONVERSATION_PROMPT, OPENAI_MODEL } from "./prompt";
import { GraphModel } from "./graphmodel";
import { ConversationOptions } from './types';
import { GPTTokens } from 'gpt-tokens';
import { ChatCompletionRunner } from 'openai/lib/ChatCompletionRunner';
import { ChatCompletionSystemMessageParam } from 'openai/resources';

/**
 * An LLM conversation about a GraphModel
 */
export class Conversation {
    graphModel: GraphModel;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: Array<RunnableToolFunction<any>>;

    messages;
    client:OpenAI;
    runner:ChatCompletionRunner|null;
    options: ConversationOptions;

    /**
     * Creates a new Conversation
     * @param graphModel the graph model for the conversation
     * @param options the options for the conversation
     */
    constructor(graphModel: GraphModel, options: ConversationOptions) {
        this.graphModel = graphModel;
        this.tools = graphModel.getTools(options.toolOptions);
        this.client = new OpenAI(options.openAiOptions?.clientOptions);
        this.runner = null;
        this.options = options;
    }

    /**
     * Reinitializes the messages, adds a user messages and runs
     * to completion. Used for stateless execution.
     * @param messages the existing messages
     * @param content the user message to add to the conversation
     * @returns all the messages
     */
    async runMessages(messages, content: string) {
        this.runner = this.client.beta.chat.completions
            .runTools({
                model: this.options.openAiOptions?.model ?? OPENAI_MODEL,
                messages: [...messages, { role: 'user', content }],
                tools: this.tools
            });
        await this.runner.finalContent();
        this.trimMessages();
        return this.runner.messages;
    }

    private trimMessages() {
        if (this.runner && this.runner.messages && this.options.maxContextSize) {
            let used = this.getUsedTokens();
            while (used?.usedTokens && used?.usedTokens > this.options.maxContextSize) {
                this.runner.messages.splice(1, 1); // remove the second element, so we leave the system message
                this.options.logger?.info(`Trimmed conversation history, used: ${used?.usedTokens}`);
                used = this.getUsedTokens();
            }
        }
    }

    /**
     * The system message
     * @returns the system message for the conversation
     */
    getSystemMessage() : ChatCompletionSystemMessageParam {
        return {
            role: 'system',
            content: this.options.systemPrompt ? this.options.systemPrompt : CONVERSATION_PROMPT,
        };
    }

    /**
     * Adds a user message to a conversation that uses the
     * graph model as a tool(s)
     * @param content the user message to add to the conversation
     * @returns the final result message
     */
    async appendUserMessage(content: string) {
        if (!this.runner) {
            this.runner = this.client.beta.chat.completions
                .runTools({
                    model: this.options.openAiOptions?.model ?? OPENAI_MODEL,
                    messages: [
                        this.getSystemMessage(),
                        { role: 'user', content }
                    ],
                    tools: this.tools
                });
        }
        else {
            const messages = this.runner.messages.concat([{ role: 'user', content }]);
            this.runner = this.client.beta.chat.completions.runTools({
                model: this.options.openAiOptions?.model ?? OPENAI_MODEL,
                messages,
                tools: this.tools
            });
        }
        const result = await this.runner.finalContent();
        this.trimMessages();
        return result;
    }

    /**
     * Returns the used tokens for the conversation
     * @returns the used tokens for the conversation messages
     * or undefined if a user message has not been added
     */
    getUsedTokens(): GPTTokens | undefined {
        if (this.runner && this.runner.messages && this.runner.messages.length > 1) {
            return new GPTTokens({
                model: this.options.openAiOptions?.model ?? OPENAI_MODEL,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                messages: this.runner.messages as any,
            })
        }
    }
}