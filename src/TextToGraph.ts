import { Conversation } from "./Conversation";
import { GraphModel } from "./graphmodel";
import { TEXT_TO_GRAPH_PROMPT } from "./prompt";
import { TextToGraphOptions } from './types';

/**
 * Converts natural language text to Graph Nodes and merges them
 * into the knowlege graph.
 */
export class TextToGraph {
    conversation: Conversation;
    options: TextToGraphOptions;

    /**
     * Creates a new TextToGraph
     * @param graphModel the graph model
     * @param options the options for the text to graph conversion
     */
    constructor(graphModel: GraphModel, options: TextToGraphOptions) {
        this.options = options;
        this.conversation = new Conversation(graphModel, {
            toolOptions: {
                mergeNodesAndRelatioships: true,
            },
            logger: options.logger,
            openAiOptions: options.openAiOptions,
            systemPrompt: options.textToGraphPrompt ? options.textToGraphPrompt : TEXT_TO_GRAPH_PROMPT,
        });
    }

    /**
     * Converts text to graph nodes and relationships and adds them to the knowlege graph
     * @param text the text to extract nodes and relationships from
     * @returns an object that describes which nodes and relationships were added
     */
    async mergeText(text: string) {
        const messages = await this.conversation.runMessages([this.conversation.getSystemMessage()], `Add the nodes in this text to the knowledge graph: ${text}`);
        const relationships:Array<string> = [];
        const nodes:Array<string> = [];
        for(let n=0; n < messages.length; n++) {
            const msg = messages[n];
            if(msg.role === 'tool' && msg.content) {
                if(msg.content.startsWith('created relationship')) {
                    relationships.push(msg.content);
                }
                else if(msg.content.startsWith('created node')) {
                    nodes.push(msg.content);
                }
            }
        }
        return {
            nodes,
            relationships
        }
    }
}