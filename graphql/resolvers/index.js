const User = require("../../models/user.model"),
    Event = require("../../models/event.model"),
    Booking = require("../../models/booking.model"),
    bcrypt = require("bcrypt");

// * define the structure of graphql
// * query - get
// * mutation - post
// * ! - not nullable
//helper functions
const user = async (id) => {
    try {
        const user = await User.findById(id);
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents),
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};
const events = async (ids) => {
    try {
        const events = await Event.find({ _id: { $in: ids } });
        return events.map((event) => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator),
            };
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};
const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return { ...event._doc, creator: user.bind(this, event.creator) };
    } catch (err) {
        console.log(err);
        throw err;
    }
};
module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map((event) => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator),
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map((booking) => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                };
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            ...args.eventInput,
            date: new Date(args.eventInput.date),
            creator: "5fa9afc76704a712d8969fb6",
        });
        let createdEvent;
        // * return to perform async
        try {
            const result = await event.save();
            console.log({ ...result._doc });
            createdEvent = {
                ...result._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator),
            };
            const userFound = await User.findById("5fa9afc76704a712d8969fb6");
            if (!userFound) {
                throw "User doesn't exist";
            }
            userFound.createdEvents.push(event);
            await userFound.save();
            // console.log(result);
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) throw new Error("User already Exists");
            const hashed = await bcrypt.hash(args.userInput.password, 12);
            const newUser = new User({
                ...args.userInput,
                password: hashed,
            });
            const result = await newUser.save();
            return { ...result._doc, password: null };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookEvent: async (args) => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        console.log({ ...fetchedEvent._doc });
        const booking = new Booking({
            user: "5fa9afc76704a712d8969fb6",
            event: fetchedEvent._doc._id,
            // event: fetchedEvent,
        });
        const result = await booking.save();
        // console.log({ ...result._doc });
        return {
            ...result._doc,
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
        };
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate(
                "event",
            );
            if (!booking) throw "Booking not found";
            const event = {
                ...booking.event._doc,
                creator: user.bind(this, booking.event._doc.creator),
            };
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};
