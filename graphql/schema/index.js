const { buildSchema } = require("graphql");
module.exports = buildSchema(`
            type Booking {
                _id:ID!
                event:Event!
                user:User!
                createdAt:String!
                updatedAt:String!
            }
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
            input UpdateEventInput {
                _id:String!
                title: String!
                description: String!
                price: Float!
                date: String!
                creatorId:String!
            }
            type AuthData{
                userId:ID!
                token:String!
                tokenExpiration:Int!

            }
            type RootQuery{
                events: [Event!]!
                event(id:ID!): Event!
                bookings:[Booking!]!
                login(email:String!,password:String!):AuthData
            }    
            type RootMutation{
                createEvent(eventInput : EventInput): Event
                updateEvent(eventInput : UpdateEventInput): Event
                deleteEvent(eventId:ID!,creatorId:ID!):Event!
                createUser(userInput : UserInput): AuthData
                bookEvent(eventId:ID!): Booking!
                cancelBooking(bookingId:ID!):Event!
            }
            schema{
                    query: RootQuery
                    mutation: RootMutation
                }
        `);
