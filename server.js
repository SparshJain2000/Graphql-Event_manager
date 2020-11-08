const bodyParser = require("body-parser"),
    express = require("express"),
    { graphqlHTTP } = require("express-graphql"),
    { buildSchema } = require("graphql");
app = express();
const PORT = 8080;
app.use(bodyParser.json());
const events = [];
// * define the structure of graphql
// * query - get
// * mutation - post
// * ! - not nullable
app.use(
    "/graphql",
    graphqlHTTP({
        // ? define schema
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
        }
        // todo define types
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
        // ? resolvers here
        rootValue: {
            events: () => {
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    ...args.eventInput,
                    date: new Date().toISOString(),
                };
                events.push(event);
                return event;
            },
        },
        graphiql: true,
    }),
);

app.listen(PORT, (req, res) => {
    console.log(`Listening to ${PORT} 🎊`);
});
