const User = require("../../models/user.model"),
    Event = require("../../models/event.model"),
    { transformEvent } = require("./merge");

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
};
