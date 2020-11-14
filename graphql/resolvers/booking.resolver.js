const Event = require("../../models/event.model"),
    Booking = require("../../models/booking.model"),
    { transformEvent, transformBooking } = require("./merge");

module.exports = {
    bookings: async (args, req) => {
        // console.log(req);
        if (!req.isAuth) throw new Error("Not Authenticated");
        try {
            const bookings = await Booking.find();
            return bookings.map((booking) => transformBooking(booking));
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    bookEvent: async (args, req) => {
        if (!req.isAuth) throw new Error("Not Authenticated");
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        console.log({ ...fetchedEvent._doc });
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent._doc._id,
            // event: fetchedEvent,
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) throw new Error("Not Authenticated");
        try {
            const booking = await Booking.findById(args.bookingId).populate(
                "event",
            );
            if (!booking) throw new Error("Booking not found");
            const event = transformEvent(booking.event);
            // * can use booking._doc.event (_doc dont have meta data)
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};
