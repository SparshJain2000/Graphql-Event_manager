const { pathToArray } = require("graphql/jsutils/Path");
const User = require("../../models/user.model"),
    jwt = require("jsonwebtoken"),
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
            const token = jwt.sign(
                { userId: result.id, email: result.email },
                process.env.secret,
                { expiresIn: "1h" },
            );
            return {
                userId: result.id,
                token,
                tokenExpiration: 1,
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throw new Error("Incorrect Password");
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.secret,
            { expiresIn: "1h" },
        );
        return {
            userId: user.id,
            token,
            tokenExpiration: 1,
        };
    },
};
