const express = require('express');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Event = require('./models/event');
const User = require('./models/user');
const app = express();

const events = [];

dotenv.config();

app.use(bodyParser.json());
app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                createdAt: String!
                updatedAt: String!
            }

            type User {
                _id: ID!
                username: String!
                firstName: String!
                lastName: String!
                password: String
                createdAt: String!
                updatedAt: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
            }

            input UserInput {
                username: String!
                firstName: String!
                lastName: String!
                password: String!
            }

            type RootQuery {
                events: [Event!]!
            }
        
            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }
        
            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return { ...event._doc, _id: event.id };
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                    });
            },
            createEvent: args => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: args.eventInput.price,
                    creator: "60c49c13ccff840784728dd2"
                })
                let createdEvent;
                return event
                    .save()
                    .then(result => {
                        createdEvent = { ...result._doc, _id: result.id };
                        return User.findById("60c49c13ccff840784728dd2");
                    })
                    .then(user => {
                        if (!user) {
                            throw new Error('User not found');
                        }
                        user.events.push(event);
                        return user.save();
                    })
                    .then(user => {
                        return createdEvent;
                    })
                    .catch(err => {
                        throw err;
                    });
            },
            createUser: args => {
                return User.findOne({ username: args.userInput.username })
                    .then(user => {
                        if (user) {
                            throw new Error('User with this username already exists!');
                        }
                        return bcrypt.hash(args.userInput.password, 12)
                    })
                    .then(hashedPassword => {
                        const user = new User({
                            username: args.userInput.username,
                            firstName: args.userInput.firstName,
                            lastName: args.userInput.lastName,
                            password: hashedPassword
                        })
                        return user.save();
                    })
                    .then(user => {
                        return { ...user._doc, password: null, _id: user.id };
                    })
                    .catch(err => {
                        throw err;
                    })
            }
        },
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