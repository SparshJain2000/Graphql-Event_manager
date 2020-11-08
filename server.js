const bodyParser = require("body-parser");
const express = require("express");
app = express();
const PORT = 8080;
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.json({ message: "hello world" });
});
app.listen(PORT, (req, res) => {
    console.log(`Listening to ${PORT} 🎊`);
});
