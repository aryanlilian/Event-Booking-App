const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true 
    })
  );

app.get('/', (req, res) => {
    res.send("Hello world");
})

mongoose.connect(process.env.DB_URI_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    })
    .then((result) => {
        console.log('Connected to DB');
        app.listen(8000, () => console.log('Server is listening on port 8000'));
    })
    .catch((err) => console.log(err));