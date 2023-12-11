import { GraphModel, GraphModelOptions, getOpenAiEmbedding } from '../graphmodel.js'

const MODEL = `
namespace demo.graph@1.0.0
import org.accordproject.graph@1.0.0.{GraphNode}

// show how a complex type gets flattened
concept Address {
  o String line1
  o String line2 optional
  o String city
  o String state
  o String zip optional
  o String country
}

concept PersonProperties extends GraphNode {
  o Address address
}

concept Person extends GraphNode {
  o Address address optional
  @label("ACTED_IN")
  --> Movie[] actedIn optional
  @label("DIRECTED")
  --> Movie[] directed optional
}

concept Actor extends Person {
}

concept Director extends Person {
}

concept User extends Person {
  @label("RATED")
  --> Movie[] ratedMovies optional
}

concept Genre extends GraphNode {
}

concept Movie extends GraphNode {
  @vector_index("summary", 1536, "COSINE")
  o Double[] embedding optional
  @embedding
  o String summary optional
  @label("IN_GENRE")
  --> Genre[] genres optional
}
`;

async function run(): Promise<GraphModel> {
  const options:GraphModelOptions = {
    NEO4J_USER: process.env.NEO4J_USER,
    NEO4J_PASS: process.env.NEO4J_PASS,
    NEO4J_URL: process.env.NEO4J_URL,
    logger: console,
    logQueries: false,
    embeddingFunction: getOpenAiEmbedding
  }
  const graphModel = new GraphModel(MODEL, options);  
  await graphModel.connect();
  await graphModel.dropIndexes();
  await graphModel.createConstraints();
  await graphModel.createVectorIndexes();
  const context = await graphModel.openSession();

  const { session } = context;
  await session.executeWrite(async transaction => {
    const address = {
      $class: 'demo.graph@1.0.0.Address',
      line1: '1 Main Street',
      city: 'Boulder',
      state: 'CO',
      country: 'USA'
    };
    const summary = 'The film centres on Sam Lowry, a low-ranking bureaucrat trying to find a woman who appears in his dreams while he is working in a mind-numbing job and living in a small apartment, set in a dystopian world in which there is an over-reliance on poorly maintained (and rather whimsical) machines';
    await graphModel.mergeNode(transaction, 'demo.graph@1.0.0.Movie', {identifier: 'Brazil', summary} );
    await graphModel.mergeNode(transaction, 'demo.graph@1.0.0.Director', {identifier: 'Terry Gilliam'} );
    await graphModel.mergeRelationship(transaction, 'demo.graph@1.0.0.Director', 'Terry Gilliam', 'demo.graph@1.0.0.Movie', 'Brazil', 'directed' );
    await graphModel.mergeNode(transaction, 'demo.graph@1.0.0.User', {identifier: 'Dan', address} );
    await graphModel.mergeRelationship(transaction, 'demo.graph@1.0.0.User', 'Dan', 'demo.graph@1.0.0.Movie', 'Brazil', 'ratedMovies' );
    await graphModel.mergeNode(transaction, 'demo.graph@1.0.0.Actor', {identifier: 'Jonathan Pryce'} );
    await graphModel.mergeRelationship(transaction, 'demo.graph@1.0.0.Actor', 'Jonathan Pryce', 'demo.graph@1.0.0.Movie', 'Brazil', 'actedIn' );
    const search = 'working in a mind-numbing job and living in a small apartment';
    const results = await graphModel.similarityQuery('demo.graph@1.0.0.Movie', 'embedding', search, 3);
    console.log(results);
  });
  await session.close();
  console.log('done');
  return graphModel;
}

run();