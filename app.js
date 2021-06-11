const express = require('express');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const app = express();

app.use(bodyParser.json());
app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
            type RootQuery {
                events: [String!]!
            }
        
            type RootMutation {
                createEvent(name: String): String
            }
        
            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return ['First events', 'Second event', 'Third event'];
            },
            createEvent: (args) => {
                const eventName = args.name;
                return eventName;
            }
        },
        graphiql: true 
    })
  );

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.listen(8000, () => console.log('Server is listening on port 8000'));