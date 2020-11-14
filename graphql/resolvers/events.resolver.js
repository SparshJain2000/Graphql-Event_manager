const User = require("../../models/user.model"),
    Event = require("../../models/event.model"),
    { transformEvent, singleEvent } = require("./merge");

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
    event: async (args) => {
        return singleEvent(args.id);
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) throw new Error("Not Authenticated");
        const event = new Event({
            ...args.eventInput,
            date: new Date(args.eventInput.date),
            creator: req.userId,
        });
        let createdEvent;
        // * return to perform async
        try {
            const result = await event.save();
            console.log({ ...result._doc });
            createdEvent = transformEvent(result);
            const userFound = await User.findById(req.userId);
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
};
