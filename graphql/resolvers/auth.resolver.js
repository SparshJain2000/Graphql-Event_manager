const User = require("../../models/user.model"),
    bcrypt = require("bcrypt");

module.exports = {
    createUser: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) throw new Error("User already Exists");
            const hashed = await bcrypt.hash(args.userInput.password, 12);
            const newUser = new User({
                ...args.userInput,
                password: hashed,
            });
            const result = await newUser.save();
            return { ...result._doc, password: null };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};
