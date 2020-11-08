const bodyParser = require("body-parser"),
    express = require("express"),
    { graphqlHTTP } = require("express-graphql"),
    { buildSchema } = require("graphql");
app = express();
const PORT = 8080;
app.use(bodyParser.json());
//define the structure of graphql
//query - get
//mutation - post
// ! - not nullable
app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
        type RootQuery{
            events: [String!]!
        }    
        type RootMutation{
            createEvent(name: String): String
        }
        schema{
                query: RootQuery
                mutation: RootMutation
            }
        `),
        //  resolvers here
        rootValue: {
            events: () => {
                return ["🔥", "❤", "🎊"];
            },
            createEvent: (args) => {
                const eventName = args.name;
                return eventName;
            },
        },
        graphiql: true,
    }),
);

app.listen(PORT, (req, res) => {
    console.log(`Listening to ${PORT} 🎊`);
});
