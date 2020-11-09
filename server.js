const bodyParser = require("body-parser"),
    express = require("express"),
    { graphqlHTTP } = require("express-graphql"),
    mongoose = require("mongoose"),
    gqlSchema = require("./graphql/schema/index"),
    gqlResolvers = require("./graphql/resolvers/index");

app = express();
require("dotenv").config();
const PORT = 8080;
app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHTTP({
        // todo define schema (types) and resolvers
        schema: gqlSchema,
        // * resolvers here
        rootValue: gqlResolvers,
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
