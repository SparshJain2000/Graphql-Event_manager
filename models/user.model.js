const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        requried: true,
    },
    createdEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
    ],
});
module.exports = mongoose.model("User", userSchema);
