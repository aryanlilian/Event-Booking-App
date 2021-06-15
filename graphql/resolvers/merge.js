const Event = require('../../models/event');
const User = require('../../models/user');
const transformDate = require('../../helpers/date');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        creator: findUser.bind(this, event._doc.creator),
        createdAt: transformDate(event._doc.createdAt),
        updatedAt: transformDate(event._doc.updatedAt),
    };
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        event: findEvent.bind(this, booking._doc.event),
        user: findUser.bind(this, booking._doc.user),
        createdAt: transformDate(booking._doc.createdAt),
        updatedAt: transformDate(booking._doc.updatedAt),
    };
}

const findEvents = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const findUser = async id => {
    try {
        const user = await User.findById(id);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: findEvents.bind(this, user._doc.createdEvents),
            createdAt: transformDate(user._doc.createdAt),
            updatedAt: transformDate(user._doc.updatedAt)
        };
    } catch (err) {
        throw err;
    }
};

const findEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    transformEvent,
    transformBooking,
    findEvents,
    findUser,
    findEvent
}