const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        username: String!
        firstName: String!
        lastName: String!
        password: String
        createdEvents: [Event!]
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
        users: [User!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)