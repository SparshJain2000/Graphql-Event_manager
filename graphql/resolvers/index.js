const User = require("../../models/user.model"),
    Event = require("../../models/event.model"),
    bcrypt = require("bcrypt");

// * define the structure of graphql
// * query - get
// * mutation - post
// * ! - not nullable
//helper functions
const user = (id) => {
    return User.findById(id)
        .then((user) => {
            return {
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvents),
            };
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};
const events = (ids) => {
    return Event.find({ _id: { $in: ids } })
        .then((events) => {
            return events.map((event) => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator),
                };
            });
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};
module.exports = {
    events: () => {
        return Event.find()
            .then((res) => {
                return res.map((event) => {
                    return {
                        ...event._doc,
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator),
                    };
                });
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    },
    createEvent: (args) => {
        const event = new Event({
            ...args.eventInput,
            date: new Date(args.eventInput.date),
            creator: "5fa993f1dd57e62c14324b98",
        });
        let createdEvent;
        // * return to perform async
        return event
            .save()
            .then((res) => {
                console.log({ ...res._doc });
                createdEvent = {
                    ...res._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, res._doc.creator),
                };
                return User.findById("5fa993f1dd57e62c14324b98");
            })
            .then((user) => {
                if (!user) {
                    throw "User doesn't exist";
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then((result) => {
                console.log(result);
                return createdEvent;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    },
    createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
            .then((user) => {
                if (user) {
                    throw new Error("User already Exists");
                }
                return bcrypt
                    .hash(args.userInput.password, 12)
                    .then((hashed) => {
                        const user = new User({
                            ...args.userInput,
                            password: hashed,
                        });
                        return user.save();
                    })
                    .then((result) => {
                        console.log(result);
                        return { ...result._doc, password: null };
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    },
};
