const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge')

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);   
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const booking = await new Booking({
                event: args.eventId,
                user: "60c4d3450b4d5b0d46360f73"
            });
            await booking.save();
            return transformBooking(booking);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {
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