const bodyParser = require("body-parser"),
    express = require("express"),
    { graphqlHTTP } = require("express-graphql"),
    { buildSchema } = require("graphql"),
    mongoose = require("mongoose"),
    Event = require("./models/event.model");

app = express();
require("dotenv").config();
const PORT = 8080;
app.use(bodyParser.json());
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
                            return { ...event._doc };
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
                });
                // * return to perform async
                return event
                    .save()
                    .then((res) => {
                        console.log({ ...res._doc });
                        return { ...res._doc };
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
