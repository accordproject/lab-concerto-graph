
import {GraphModel} from './graphmodel'

describe('GraphModel', () => {

    describe('constructor', () => {
        it('should create and return a GraphModel', async () => {
            const cto = `namespace test@1.0.0`;
            const options = {
                NEO4J_URL: 'Pasta',
                NEO4J_PASS: 'pasta',
            }
            const graphModel = new GraphModel(cto, options);
            expect(graphModel).not.toBeNull()
        })
    })
})