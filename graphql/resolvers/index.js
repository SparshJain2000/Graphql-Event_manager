const User = require("../../models/user.model"),
    Event = require("../../models/event.model"),
    Booking = require("../../models/booking.model"),
    { dateToString } = require("../../helpers/date.helper"),
    bcrypt = require("bcrypt");

// * define the structure of graphql
// * query - get
// * mutation - post
// * ! - not nullable
// todo helper functions
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
                date: dateToString(event._doc.date),
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
        return transformEvent(event);
    } catch (err) {
        console.log(err);
        throw err;
    }
};
const transformEvent = (event) => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator),
    };
};
const transformBooking = (booking) => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
};
module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map((event) => transformEvent(event));
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map((booking) => transformBooking(booking));
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
            createdEvent = transformEvent(result);
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
        return transformBooking(result);
    },
    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate(
                "event",
            );
            if (!booking) throw "Booking not found";
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
