const Event = require("../../models/event.model");
const User = require("../../models/user.model");
const DataLoader = require("dataloader");
const { dateToString } = require("../../helpers/date.helper");

const eventLoader = new DataLoader((eventIds) => events(eventIds));
const userLoader = new DataLoader((userIds) => {
    return User.find({ _id: { $in: userIds } });
});

const user = async (id) => {
    try {
        const user = await userLoader.load(id.toString());
        return {
            ...user._doc,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};
const events = async (ids) => {
    try {
        const events = await Event.find({ _id: { $in: ids } });
        events.sort(
            (a, b) =>
                ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString()),
        );
        return events.map((event) => transformEvent(event));
    } catch (err) {
        console.log(err);
        throw err;
    }
};
const singleEvent = async (eventId) => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
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
