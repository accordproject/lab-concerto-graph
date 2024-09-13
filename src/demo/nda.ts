import { GraphModel, GraphModelOptions, getOpenAiEmbedding, ConsoleLogger } from '..'
import { TextToGraph } from '../TextToGraph';

const NS = 'demo.agreements@1.0.0';

const MODEL = `
@description("Ask questions about the parties and obligations defined in non-disclosure agreements.")
namespace ${NS}
import org.accordproject.graph@1.0.0.{GraphNode}

@questions("How many NDAs do we have?", "What is the length of the NDA?", "Who are the signatories of the NDA?")
concept NDA extends GraphNode {
  o DateTime effectiveDate optional
  o Integer termInYears optional
  o String purpose optional
  o Double[] embedding optional
  @vector_index("embedding", 1536, "COSINE")
  @fulltext_index
  o String summary optional
  @label("SIGNATORY")
  --> LegalEntity[] signatories optional
  @label("CREATES_OBLIGATION")
  --> Obligation[] obligations optional
}

abstract concept LegalEntity extends GraphNode {
   @fulltext_index
   o String name
   @fulltext_index
   o String address optional
}

@questions("How many companies are there?")
concept Company extends LegalEntity {
   o String companyNumber optional
}

@questions("How many people are there?", "Use a query to determine whether any persons in the database have been disqualified.")
concept Person extends LegalEntity {
   o DateTime dob optional
   o Boolean disqualified optional
}

@questions("Which obligations are related to disclosure of confidential information?")
concept Obligation extends GraphNode {
  o Double[] embedding optional
  @vector_index("embedding", 1536, "COSINE")
  @fulltext_index
  o String text optional
  o String type optional
  o String clauseId optional
  @label("PROMISOR")
  --> LegalEntity[] promisors optional
    @label("PROMISEE")
  --> LegalEntity[] promisees optional
}`;

function getNda(personName:string, personAddress:string, date:string, purpose:string, termInYears: string, witnessName:string, witnessAddress:string) {
  return `NDA Between ${personName} and Docusign Limited

  Date: ${date}
  
  Parties:
  ${personName} of ${personAddress}
  (the Recipient)
  and
  Docusign Limited, a company registered in England under
  company number 10308354 whose registered office is at The Pavilions, Bridgwater Road, Bristol, BS13 8FD, England.
  (the Discloser)
  
  1. The Discloser intends to disclose information (the Confidential Information) to the Recipient for
  the purpose of ${purpose} (the Purpose).
  2. The Recipient undertakes not to use the Confidential Information for any purpose except the
  Purpose, without first obtaining the written agreement of the Discloser.
  3. The Recipient undertakes to keep the Confidential Information secure and not to disclose it to
  any third party [except to its employees [and professional advisers] who need to know the
  same for the Purpose, who know they owe a duty of confidence to the Discloser and who are
  bound by obligations equivalent to those in clause 2 above and this clause 3.
  4. The undertakings in clauses 2 and 3 above apply to all of the information disclosed by the
  Discloser to the Recipient, regardless of the way or form in which it is disclosed or recorded but
  they do not apply to:
  a) any information which is or in future comes into the public domain (unless as a result of the
  breach of this Agreement); or
  b) any information which is already known to the Recipient and which was not subject to any
  obligation of confidence before it was disclosed to the Recipient by the Discloser.
  5. Nothing in this Agreement will prevent the Recipient from making any disclosure of the
  Confidential Information required by law or by any competent authority.
  6. The Recipient will, on request from the Discloser, return all copies and records of the
  Confidential Information to the Discloser and will not retain any copies or records of the
  Confidential Information.
  7. Neither this Agreement nor the supply of any information grants the Recipient any licence,
  interest or right in respect of any intellectual property rights of the Discloser except the right to
  copy the Confidential Information solely for the Purpose.
  8. The undertakings in clauses 2 and 3 will continue in force for ${termInYears}
  years from the date of this Agreement.
  9. This Agreement is governed by, and is to be construed in accordance with, English law. The
  English Courts will have non-exclusive jurisdiction to deal with any dispute which has arisen or
  may arise out of, or in connection with, this Agreement.
  
  Signed and Delivered as a Deed by:
  ${personName} in the presence of:
  
  X
  _____________________________
  Signature
  
  Y
  _____________________________
  Signature of witness
  
  ${witnessName}
  _____________________________
  Name of witness
  
  ${witnessAddress}
  _____________________________
  Address of witness
  `;
}

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
  await graphModel.deleteGraph();
  await graphModel.dropIndexes();
  await graphModel.createIndexes();
  await graphModel.mergeConcertoModels(); // saves models to graph
  // await graphModel.loadConcertoModels(); // loads models from graph
  const context = await graphModel.openSession();
  {
    const PROMPT_NDA = `You are a legal expert that reads NDAs, extracting parties and obligations. 
    Convert this NDA into nodes and relationships in our knowledge graph, which you can access using tools. 
    The nodes and edges in the graph are described using the following Accord Project Concerto model: 
    \`\`\`
    ${MODEL}
    \`\`\`

    Create all nodes before you create edges. Use the model and the registered tools to convert the 
    text of the NDA to set of nodes and edges in the knowledge graph. Create as many nodes and edges 
    as possible, populating their properties based on the model.

    Do not create or query nodes for abstract concepts. 

    Create identifiers for 'person' and 'company' nodes by converting the names to lower case 
    and replacing spaces and special characters with underscore '_'.

    Create identifiers for 'obligation' nodes by appending the clause number to the NDA identifier,
    separating them with an underscore '_'.

    Create identifiers for 'NDA' nodes by converting the NDA recipient name to lower case and appending the
    NDA discloser name in lower case, separating them with an underscore '_'.`;
    const textToGraph = new TextToGraph(graphModel, { logger, maxContextSize: 64000, textToGraphPrompt: PROMPT_NDA });
    const results1 = await textToGraph.mergeText(getNda('Dan Selman', '163 City Rd, London EC1V 1NR, England', '12th Sept 2024', 'software development', '4', 'Matt Roberts', '150 Ossulston St, London NW1 1EE'));
    logger.success('added nodes and relationships to graph', results1);
    const results2 = await textToGraph.mergeText(getNda('Allan C. Thygesen', '221 Main St #800, San Francisco, CA 94105, USA', '8th July 2024', 'international expansion', 'ten', 'Matt Roberts', '150 Ossulston St, London NW1 1EE'));
    logger.success('added nodes and relationships to graph', results2);
    const results3 = await textToGraph.mergeText(getNda('Kris Smith', '1 Main St, San Francisco, CA 94105, USA', '7th April 2024', 'acqusition', '3', 'Matt Roberts', '150 Ossulston St, London NW1 1EE'));
    logger.success('added nodes and relationships to graph', results3);
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
