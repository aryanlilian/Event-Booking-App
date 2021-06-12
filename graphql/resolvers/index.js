const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const findEvents = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id,
                createdAt: new Date(event._doc.createdAt).toISOString(),
                updatedAt: new Date(event._doc.updatedAt).toISOString(),
                creator: findUser.bind(this, event._doc.creator) 
            };
        });
    } catch (err) {
        throw err;
    }
}

const findUser = async id => {
    try {
        const user = await User.findById(id);
        return {
            ...user._doc, 
            _id: user.id,
            createdEvents: findEvents.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return { 
                    ...event._doc, 
                    _id: event.id,
                    createdAt: new Date(event._doc.createdAt).toISOString(),
                    updatedAt: new Date(event._doc.updatedAt).toISOString(),
                    creator: findUser.bind(this, event._doc.creator) 
                };
            });
        } catch (err) {
            throw err;
        }
    },
    users: async () => {
        try {
        const users = await User.find()
        return users.map(user => {
            return { 
                ...user._doc, 
                _id: user.id,
                createdEvents: findEvents.bind(this, user._doc.createdEvents)
            };
        })
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
            createdEvent = { 
                ...result._doc, 
                _id: result.id,
                createdAt: new Date(event._doc.createdAt).toISOString(),
                updatedAt: new Date(event._doc.updatedAt).toISOString(),
                creator: findUser.bind(this, event._doc.creator) 
            };
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
    createUser: async args => {
        try {
            const checkUser = await User.findOne({ username: args.userInput.username })
            
            if (checkUser) {
                throw new Error('User with this username already exists!');
            }
            
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const newUser = await new User({
                username: args.userInput.username,
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
                password: hashedPassword
            });
            const savedUser = await newUser.save();
            
            return { 
                ...savedUser._doc, 
                password: null, 
                _id: savedUser.id,
            };
        } catch (err) {
            throw err;
        }
    }
}