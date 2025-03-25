const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "C:\\Users\\Admin\\OneDrive\\Desktop\\web development\\Assignment\\Binnys_Backend\\.env.local" })
const MONGO_URI = process.env.MONGO_URI;
const connectToMongo = async () => {
    try {
        console.log("MONGO URI", MONGO_URI)
        await mongoose.connect(MONGO_URI);
        console.log("Connected to mongodb successfully");
    } catch (error) {
        console.log("Error connecting to mongoDB", error);

    }
};
module.exports = connectToMongo;