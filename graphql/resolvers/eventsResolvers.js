const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            creator: '60c4d3450b4d5b0d46360f73'
        })
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById("60c4d3450b4d5b0d46360f73");

            if (!creator) {
                throw new Error('User not found');
            }

            creator.createdEvents.push(event);
            await creator.save(); 
            
            return createdEvent;
        } catch (err) {
            throw err;
        }
    },
}