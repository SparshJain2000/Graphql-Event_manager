const bodyParser = require("body-parser"),
    express = require("express"),
    { graphqlHTTP } = require("express-graphql"),
    { buildSchema } = require("graphql"),
    bcrypt = require("bcrypt"),
    mongoose = require("mongoose"),
    User = require("./models/user.model"),
    Event = require("./models/event.model");

app = express();
require("dotenv").config();
const PORT = 8080;
app.use(bodyParser.json());
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
                    creator: user.bind(this, event.creator),
                };
            });
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};
// * define the structure of graphql
// * query - get
// * mutation - post
// * ! - not nullable
app.use(
    "/graphql",
    graphqlHTTP({
        // todo define schema (types) and resolvers
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: String!
                date: String!
                creator: User!
            }   
            type User {
                _id:ID!
                email:String!
                password:String
                createdEvents :[Event!]
            }
            input UserInput{
                email:String!
                password:String!
            }
            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }
            
            type RootQuery{
                events: [Event!]!
            }    
            type RootMutation{
                createEvent(eventInput : EventInput): Event
                createUser(userInput : UserInput): User
            }
            schema{
                    query: RootQuery
                    mutation: RootMutation
                }
        `),
        // * resolvers here
        rootValue: {
            events: () => {
                return Event.find()
                    .then((res) => {
                        return res.map((event) => {
                            return {
                                ...event._doc,
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
        },
        graphiql: true,
    }),
);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("connected to MONGO");
    });
app.listen(PORT, () => {
    console.log(`Listening to ${PORT} 🎊`);
});
