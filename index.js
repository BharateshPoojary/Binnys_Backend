const movies = require("./routes/movies.js");
const cors = require("cors");
const express = require("express");
const connectToMongo = require("./config/dbConnect")
const app = express();
const auth = require("./routes/auth.js");
(async () => {
    await connectToMongo();
})();
app.use(cors());
app.use(express.json());
app.use("/api/movies", movies);
app.use("/api/auth", auth);
app.get("/", (req, res) => {
    res.send("Hi from backend")
})
const PORT = 3000;
const HOST = "localhost";

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
