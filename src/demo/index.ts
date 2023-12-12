import { GraphModel, GraphModelOptions, getOpenAiEmbedding } from '../graphmodel.js'

const NS = 'demo.graph@1.0.0';

const MODEL = `
namespace ${NS}
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

// show how maps get flattened
scalar PersonName extends String
scalar PersonEmail extends String
map AddressBook {
  o PersonName
  o PersonEmail
}

concept Person extends GraphNode {
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
  o Address address
  o AddressBook addressBook
  @label("RATED")
  --> Movie[] ratedMovies optional
}

concept Genre extends GraphNode {
}

concept Movie extends GraphNode {
  o Double[] embedding optional
  @vector_index("embedding", 1536, "COSINE")
  o String summary optional
  @label("IN_GENRE")
  --> Genre[] genres optional
}
`;

async function run() {
  const options:GraphModelOptions = {
    NEO4J_USER: process.env.NEO4J_USER,
    NEO4J_PASS: process.env.NEO4J_PASS,
    NEO4J_URL: process.env.NEO4J_URL,
    logger: console,
    logQueries: false,
    embeddingFunction: process.env.OPENAI_API_KEY ? getOpenAiEmbedding : undefined
  }
  const graphModel = new GraphModel([MODEL], options);  
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
    const addressBook = {
      'Dan' : 'dan@example.com'
    };
    await graphModel.mergeNode(transaction, 'Movie', {identifier: 'Brazil', summary: 'The film centres on Sam Lowry, a low-ranking bureaucrat trying to find a woman who appears in his dreams while he is working in a mind-numbing job and living in a small apartment, set in a dystopian world in which there is an over-reliance on poorly maintained (and rather whimsical) machines'} );
    await graphModel.mergeNode(transaction, 'Movie', {identifier: 'The Man Who Killed Don Quixote', summary: 'Instead of a literal adaptation, Gilliam\'s film was about "an old, retired, and slightly kooky nobleman named Alonso Quixano".'} );
    await graphModel.mergeNode(transaction, 'Movie', {identifier: 'Fear and Loathing in Las Vegas', summary: 'Duke, under the influence of mescaline, complains of a swarm of giant bats, and inventories their drug stash. They pick up a young hitchhiker and explain their mission: Duke has been assigned by a magazine to cover the Mint 400 motorcycle race in Las Vegas. They bought excessive drugs for the trip, and rented a red Chevrolet Impala convertible.'} );

    await graphModel.mergeNode(transaction, 'Genre', {identifier: 'Comedy'} );
    await graphModel.mergeNode(transaction, 'Genre', {identifier: 'Science Fiction'} );

    await graphModel.mergeRelationship(transaction, 'Movie', 'Brazil', 'Genre', 'Comedy', 'genres' );
    await graphModel.mergeRelationship(transaction, 'Movie', 'Brazil', 'Genre', 'Science Fiction', 'genres' );
    await graphModel.mergeRelationship(transaction, 'Movie', 'The Man Who Killed Don Quixote', 'Genre', 'Comedy', 'genres' );
    await graphModel.mergeRelationship(transaction, 'Movie', 'Fear and Loathing in Las Vegas', 'Genre', 'Comedy', 'genres' );

    await graphModel.mergeNode(transaction, 'Director', {identifier: 'Terry Gilliam'} );
    await graphModel.mergeRelationship(transaction, 'Director', 'Terry Gilliam', 'Movie', 'Brazil', 'directed' );
    await graphModel.mergeRelationship(transaction, 'Director', 'Terry Gilliam', 'Movie', 'The Man Who Killed Don Quixote', 'directed' );
    await graphModel.mergeRelationship(transaction, 'Director', 'Terry Gilliam', 'Movie', 'Fear and Loathing in Las Vegas', 'directed' );

    await graphModel.mergeNode(transaction, 'User', {identifier: 'Dan', address, addressBook} );
    await graphModel.mergeRelationship(transaction, 'User', 'Dan', 'Movie', 'Brazil', 'ratedMovies' );
    
    await graphModel.mergeNode(transaction, 'Actor', {identifier: 'Jonathan Pryce'} );
    await graphModel.mergeRelationship(transaction, 'Actor', 'Jonathan Pryce', 'Movie', 'Brazil', 'actedIn' );
    await graphModel.mergeRelationship(transaction, 'Actor', 'Jonathan Pryce', 'Movie', 'The Man Who Killed Don Quixote', 'actedIn' );

    await graphModel.mergeNode(transaction, 'Actor', {identifier: 'Johnny Depp'} );
    await graphModel.mergeRelationship(transaction, 'Actor', 'Johnny Depp', 'Movie', 'Fear and Loathing in Las Vegas', 'actedIn' );
  });
  if(process.env.OPENAI_API_KEY) {
    const search = 'Working in a boring job and looking for love.';
    console.log(`Searching for movies related to: '${search}'`);
    const results = await graphModel.similarityQuery('Movie', 'summary', search, 3);
    console.log(results);  
  }
  await graphModel.closeSession(context);
  console.log('done');
}

run();