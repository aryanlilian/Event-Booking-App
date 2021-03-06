const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const { findEvents } = require('./merge');
const jwt = require('jsonwebtoken');

module.exports = {
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return { 
                    ...user._doc, 
                    _id: user.id,
                    createdEvents: findEvents.bind(this, user._doc.createdEvents),
                    createdAt: transformDate(user._doc.createdAt),
                    updatedAt: transformDate(user._doc.updatedAt)
                };
            });
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
                createdAt: transformDate(user._doc.createdAt),
                updatedAt: transformDate(user._doc.updatedAt)
            };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ username, password }) => {
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new Error('User not found!');
        }

        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        if (!passwordIsCorrect) {
            throw new Error('Password is incorrect!')
        }

        const token =  jwt.sign(
            { userId: user.id, email: user.email },
            process.env.LOGIN_SECRET,
            { expiresIn: '1h' } 
        )
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };
    }
}