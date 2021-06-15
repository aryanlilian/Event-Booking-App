const authResolvers = require('./authResolvers');
const bookingResolvers = require('./bookingResolvers');
const eventsResolvers = require('./eventsResolvers');

const rootResolver = {
    ...authResolvers,
    ...bookingResolvers,
    ...eventsResolvers
}

module.exports = rootResolver;