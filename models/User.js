const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"]
    },
    Date: {
        type: Date,
        default: Date.now(),
    }
})
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;