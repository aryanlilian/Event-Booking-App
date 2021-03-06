const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge')

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuthenticated) {
            throw new Error('Unauthenticated!');
        }
        
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);   
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuthenticated) {
            throw new Error('Unauthenticated!');
        }
        
        try {
            const booking = await new Booking({
                event: args.eventId,
                user: req.userId
            });
            await booking.save();
            return transformBooking(booking);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuthenticated) {
            throw new Error('Unauthenticated!');
        }
        
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
}