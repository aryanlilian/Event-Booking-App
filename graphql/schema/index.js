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

    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type AuthData {
        userId: ID
        token: String!
        tokenExpiration: Int!
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
        bookings: [Booking!]!
        login(username: String!, password: String!): AuthData!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)