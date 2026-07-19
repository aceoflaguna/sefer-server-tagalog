const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", require("./routes/api"));

app.listen(5000, () => {
    console.log("Running http://localhost:5000");
});