import { GraphModel, GraphModelOptions, getOpenAiEmbedding, ConsoleLogger } from '..'
import { TextToGraph } from '../TextToGraph';

const NS = 'demo.agreements@1.0.0';

const MODEL = `
@description("Ask questions people.")
namespace ${NS}
import org.accordproject.graph@1.0.0.{GraphNode}

abstract concept LegalEntity extends GraphNode {
   @fulltext_index
   o String name
   @fulltext_index
   o String address optional
}

@questions("How many people are there?")
concept Person extends LegalEntity {
   o DateTime dob optional
   o Boolean disqualified optional
}`;

const DISQUALIFIED = {
  "links": {
    "self": "/disqualified-officers/natural/wJHVoMnBgx4l4YcQX7i_uhSMIVE"
  },
  "address": {
    "locality": "Margate",
    "country": "United Kingdom",
    "region": "Thanet",
    "postal_code": "BT35 6LF",
    "address_line_1": "Hartsdown Road",
    "premises": "11"
  },
  "matches": {
    "snippet": [
      4,
      7,
      9,
      16
    ]
  },
  "snippet": "Mr Kris Smith",
  "description": "Born on 3 August 1987 - Disqualified",
  "title": "Kris Smith",
  "description_identifiers": [
    "born-on"
  ],
  "kind": "searchresults#disqualified-officer",
  "address_snippet": "11 Hartsdown Road, Margate, Thanet, United Kingdom, BT35 6LF",
  "date_of_birth": "1987-08-03T00:00:00"
};

async function run() {
  const logger = ConsoleLogger;
  const options: GraphModelOptions = {
    NEO4J_USER: process.env.NEO4J_USER,
    NEO4J_PASS: process.env.NEO4J_PASS,
    NEO4J_URL: process.env.NEO4J_URL,
    logger,
    logQueries: false,
    embeddingFunction: process.env.OPENAI_API_KEY ? getOpenAiEmbedding : undefined
  }
  const graphModel = new GraphModel([MODEL], options);
  await graphModel.connect();
  const context = await graphModel.openSession();
  {
    const PROMPT_COMPANIES_HOUSE = `Convert this JSON response from the companies house API for a 
    disqualified company officer into nodes and relationships in our knowledge graph, which you can access using tools. 
    The nodes and edges in the graph are described using the following Accord Project Concerto model: 
    \`\`\`
    ${MODEL}
    \`\`\`
    
    Create identifiers for 'person' nodes by converting the title to lower case 
    and replacing spaces and special characters with underscore '_'.
    `;
    const chTextToGraph = new TextToGraph(graphModel, { logger, maxContextSize: 64000, textToGraphPrompt: PROMPT_COMPANIES_HOUSE });
    const results0 = await chTextToGraph.mergeText(JSON.stringify(DISQUALIFIED, null, 2));
    logger.success('added nodes and relationships to graph', results0);
  }
  await graphModel.closeSession(context);
  logger.log('done');
  process.exit();
}

try {
  run();
}
catch (err) {
  ConsoleLogger.error(err);
}
