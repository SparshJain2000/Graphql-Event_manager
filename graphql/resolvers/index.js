const authResolver = require("./auth.resolver"),
    eventResolver = require("./events.resolver"),
    bookingResolver = require("./booking.resolver");

// * define the structure of graphql
// * query - get
// * mutation - post
// * ! - not nullable

module.exports = {
    ...authResolver,
    ...eventResolver,
    ...bookingResolver,
};
