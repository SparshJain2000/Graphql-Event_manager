const Event = require("../../models/event.model");
const User = require("../../models/user.model");
const { dateToString } = require("../../helpers/date.helper");

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
const transformBooking = (booking) => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
};
const transformEvent = (event) => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator),
    };
};

module.exports = { transformEvent, transformBooking, singleEvent };
