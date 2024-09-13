import { GraphModel, GraphModelOptions, getOpenAiEmbedding, ConsoleLogger } from '..'

const NS = 'demo.agreements@1.0.0';

const MODEL = `
namespace ${NS}
import org.accordproject.graph@1.0.0.{GraphNode}

concept Agreement extends GraphNode {
  @label("SIGNATORY")
  --> LegalEntity[] signatories optional
  @label("CREATES_OBLIGATION")
  --> Obligation[] obligations optional
  @label("CONFERS_RIGHT")
  --> Right[] rights optional
  @label("AMENDED_BY")
  --> Amendment[] amendments optional
  @label("CONTAINS_CLAUSE")
  --> Clause[] clauses optional
  @label("CONTAINS_FIELD")
  --> Field[] fields optional
  @label("RELATED_AGREEMENTS")
  --> Agreement[] related optional
  @label("INSTANCE_OF")
  --> Template[] templates optional
}

concept Template extends GraphNode {
  @label("DEFINES_FIELD")
  --> FieldDefinition[] fieldDefinitions optional
}

concept Amendment extends GraphNode {
  @label("AGREEMENT")
  --> Agreement[] agreements optional
}

concept Clause extends GraphNode {
  @label("FIELDS")
  --> Field[] fields optional
}

concept Field extends GraphNode {
  @label("MODEL_REF")
  --> FieldDefinition[] definitions optional
}

concept FieldDefinition extends GraphNode {
  @label("MODEL_REF")
  --> ModelElement[] modelElements optional
}

abstract concept ModelElement extends GraphNode {}
concept Concept extends ModelElement {}
concept Property extends ModelElement {}

concept Sanction extends GraphNode {
  @label("SANCTIONED")
  --> LegalEntity[] sanctions optional
}
concept Bankruptcy extends GraphNode {
  @label("BANKRUPT")
  --> LegalEntity[] bankrupts optional
}
concept Dispute extends GraphNode {
  @label("AGREEMENT")
  --> Agreement[] agreements optional
  @label("PLAINTIFF")
  --> LegalEntity[] plaintiffs optional
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
abstract concept Promise extends GraphNode {
  o Double[] embedding optional
  @vector_index("embedding", 1536, "COSINE")
  @fulltext_index
  o String text optional
  o String type optional
  o String clauseId optional
  @label("PROMISOR")
  --> LegalEntity[] promisors optional
  @label("PROMISEE")
  --> LegalEntity[] promisee optional
  @label("DEFINED_BY")
  --> Clause[] clauses optional
}

concept Right extends Promise {}
concept Obligation extends Promise {}
`;

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
  await graphModel.mergeSamplesToGraph();
  logger.log('done');
  process.exit();
}

try {
  run();
}
catch (err) {
  ConsoleLogger.error(err);
}
