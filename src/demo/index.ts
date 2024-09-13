import { GraphModel, GraphModelOptions, getOpenAiEmbedding, ConsoleLogger } from '..'
import { Conversation } from '../Conversation';
import { TextToGraph } from '../TextToGraph';

const NS = 'demo.graph@1.0.0';

const MODEL = `
@description("Ask questions about movies and the actors and directors related to movies.")
namespace ${NS}
import org.accordproject.graph@1.0.0.{GraphNode}

concept Address {
  o String line1
  o String line2 optional
  o String city
  o String state
  o String zip optional
  o String country
}

// show how a complex type gets flattened
concept ContactDetails {
  o Address address
  o String email
}

// show how maps get flattened
scalar PersonName extends String
scalar PersonEmail extends String
map AddressBook {
  o PersonName
  o PersonEmail
}

concept Person extends GraphNode {
  @fulltext_index
  o String description optional
  @label("ACTED_IN")
  --> Movie[] actedIn optional
  @label("DIRECTED")
  --> Movie[] directed optional
}

@questions("Which actor is related to Fear and Loathing in Las Vegas?")
concept Actor extends Person {
}

concept Director extends Person {
}

concept User extends Person {
  o ContactDetails contactDetails
  o AddressBook addressBook
  @label("RATED")
  --> Movie[] ratedMovies optional
}

concept Genre extends GraphNode {
}

@questions("How many movies do we have?")
concept Movie extends GraphNode {
  o Double[] embedding optional
  @vector_index("embedding", 1536, "COSINE")
  @fulltext_index
  o String summary optional
  @label("IN_GENRE")
  --> Genre[] genres optional
}
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
  await graphModel.mergeConcertoModels(); // saves models to graph
  // await graphModel.loadConcertoModels(); // loads models from graph
  const context = await graphModel.openSession();

  // const tools = graphModel.getTools({currentDateTime: true});
  // console.log(JSON.stringify(tools, null , 2));

  const { session } = context;

  await session.executeWrite(async transaction => {
    const address = {
      $class: 'demo.graph@1.0.0.Address',
      line1: '1 Main Street',
      city: 'Boulder',
      state: 'CO',
      country: 'USA'
    };
    const contactDetails = {
      $class: 'demo.graph@1.0.0.ContactDetails',
      address,
      email: 'dan@example.com'
    };
    const addressBook = {
      'Dan': 'dan@example.com',
      'Isaac': 'isaac@example.com'
    };
    await graphModel.mergeNode(transaction, 'Movie', { identifier: 'Brazil', summary: 'The film centres on Sam Lowry, a low-ranking bureaucrat trying to find a woman who appears in his dreams while he is working in a mind-numbing job and living in a small apartment, set in a dystopian world in which there is an over-reliance on poorly maintained (and rather whimsical) machines' });
    await graphModel.mergeNode(transaction, 'Movie', { identifier: 'The Man Who Killed Don Quixote', summary: 'Instead of a literal adaptation, Gilliam\'s film was about "an old, retired, and slightly kooky nobleman named Alonso Quixano".' });
    await graphModel.mergeNode(transaction, 'Movie', { identifier: 'Fear and Loathing in Las Vegas', summary: 'Duke, under the influence of mescaline, complains of a swarm of giant bats, and inventories their drug stash. They pick up a young hitchhiker and explain their mission: Duke has been assigned by a magazine to cover the Mint 400 motorcycle race in Las Vegas. They bought excessive drugs for the trip, and rented a red Chevrolet Impala convertible.' });

    await graphModel.mergeNode(transaction, 'Genre', { identifier: 'Comedy' });
    await graphModel.mergeNode(transaction, 'Genre', { identifier: 'Science Fiction' });

    await graphModel.mergeRelationship(transaction, 'Movie', 'Brazil', 'Genre', 'Comedy', 'genres');
    await graphModel.mergeRelationship(transaction, 'Movie', 'Brazil', 'Genre', 'Science Fiction', 'genres');
    await graphModel.mergeRelationship(transaction, 'Movie', 'The Man Who Killed Don Quixote', 'Genre', 'Comedy', 'genres');
    await graphModel.mergeRelationship(transaction, 'Movie', 'Fear and Loathing in Las Vegas', 'Genre', 'Comedy', 'genres');

    await graphModel.mergeNode(transaction, 'Director', { identifier: 'Terry Gilliam' });
    await graphModel.mergeRelationship(transaction, 'Director', 'Terry Gilliam', 'Movie', 'Brazil', 'directed');
    await graphModel.mergeRelationship(transaction, 'Director', 'Terry Gilliam', 'Movie', 'The Man Who Killed Don Quixote', 'directed');
    await graphModel.mergeRelationship(transaction, 'Director', 'Terry Gilliam', 'Movie', 'Fear and Loathing in Las Vegas', 'directed');

    await graphModel.mergeNode(transaction, 'User', { identifier: 'Dan', contactDetails, addressBook });
    await graphModel.mergeRelationship(transaction, 'User', 'Dan', 'Movie', 'Brazil', 'ratedMovies');

    await graphModel.mergeNode(transaction, 'Actor', { identifier: 'Jonathan Pryce' });
    await graphModel.mergeRelationship(transaction, 'Actor', 'Jonathan Pryce', 'Movie', 'Brazil', 'actedIn');
    await graphModel.mergeRelationship(transaction, 'Actor', 'Jonathan Pryce', 'Movie', 'The Man Who Killed Don Quixote', 'actedIn');

    await graphModel.mergeNode(transaction, 'Actor', { identifier: 'Johnny Depp' });
    await graphModel.mergeRelationship(transaction, 'Actor', 'Johnny Depp', 'Movie', 'Fear and Loathing in Las Vegas', 'actedIn');

    await graphModel.mergeNode(transaction, 'Person', { identifier: 'test' });
    await graphModel.deleteNode(transaction, 'Person', 'test' );
  });
  {
        const text = `Kingdom of the Planet of the Apes

Maze Runner director Wes Ball returns to the Planet of the Apes franchise, with a story set 300 years after the events of
War for the Planet of the Apes. Pitched by Ball as Apocalypto but with apes and focusing more on action and adventure, 
the story follows a new protagonist Noa (Owen Teague) as he tries to steer the apes away from the totalitarian future 
they are headed towards. Freya Allan, Kevin Durand, Dichen Lachman, and William H. Macy star.`;

    const textToGraph = new TextToGraph(graphModel, {logger, maxContextSize: 64000});
    const results = await textToGraph.mergeText(text);
    logger.success('added nodes and relationships to graph', results);  
  }

  {
    const fullTextSearch = 'bats';
    logger.log(`Full text search for movies with: '${fullTextSearch}'`);
    const results = await graphModel.fullTextQuery('Movie', fullTextSearch, 2);
    logger.success('results', results);  
  }
  if (process.env.OPENAI_API_KEY) {
    const search = 'working in a boring job and looking for love.';    
    {
      logger.log(`Searching for movies related to: '${search}'`);
      const results = await graphModel.similarityQuery('Movie', 'summary', search, 3);
      logger.success('results', results);  
    }
    
    {
      const chat = 'Which director has directed both Johnny Depp and Jonathan Pryce, but not necessarily in the same movie?';
      logger.log(`Chat with data: ${chat}`);
      const result = await graphModel.chatWithData(chat);
      logger.success('results', result);  
    }
 
    {
      const chat = `Which director has directed a Comedy that is about the concepts of ${search}? Return a single movie.`;
      logger.log(chat);
      const result = await graphModel.chatWithData(chat);
      logger.success('results', result);  
    }

    {
      const chat = `Which actor starred in a movie about the concepts 'journalism, hitchhiking and drugs in Las Vegas'? Return the single most likely result.`;
      logger.log(chat);
      const result = await graphModel.chatWithData(chat);
      logger.success('results', result);  
    }

    {
      const chat = `What is the shortest path between the director Terry Gilliam and actor Johnny Depp?`;
      logger.log(chat);
      const result = await graphModel.chatWithData(chat);
      logger.success('results', result);  
    }

    {
      const convo = new Conversation(graphModel, {
        toolOptions: {
          getById: true,
          chatWithData: true,
          fullTextSearch: true,
          similaritySearch: true,
          currentDateTime: true,
        },
        maxContextSize: 64000,
        logger
      });
      let result = await convo.appendUserMessage('Tell me a joke about actors');
      logger.success(result);  
      result = await convo.appendUserMessage('Which director directed Fear and Loathing in Las Vegas?');
      logger.success(result);
      const questions = graphModel.getQuestions();
      for(let n=0; n < questions.length; n++) {
        const q = questions[n];
        result = await convo.appendUserMessage(q);
        logger.success(result);  
      }
    }

    {
      const convo = new Conversation(graphModel, {
        toolOptions: {
          getById: true,
          chatWithData: true,
          fullTextSearch: true,
          similaritySearch: true,
          currentDateTime: true,
        },
        maxContextSize: 64000,
        logger
      });
      const messages = await convo.runMessages([convo.getSystemMessage()], 'Which director is related to the movie Brazil?');
      logger.success('messages', messages);  
    }

    logger.log('done');
    process.exit();
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
