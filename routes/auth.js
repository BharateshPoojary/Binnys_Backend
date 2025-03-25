const express = require("express");
const UserModel = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: "C:\\Users\\Admin\\OneDrive\\Desktop\\web development\\Assignment\\Binnys_Backend\\.env.local" })
const jwt_key = process.env.JWT_SECRET_KEY;
const router = express.Router();
router.post("/createuser", async (req, res) => {
    const { username, password, confirmpassword, role } = req.body;
    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    const isExistingUser = await UserModel.findOne({ username });
    // console.log("isExistingUser", isExistingUser)
    if (isExistingUser) {
        return res.status(409).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);//genSalt function will generate a salt 
    const secure_password = await bcrypt.hash(password, salt);//hash function will generate a hash for current 
    const newUser = new UserModel({ username, password: secure_password, role });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const getUserData = await UserModel.findOne({ username });
    if (getUserData) {
        // console.log("getUserDATA", getUserData)
        const password_compare = await bcrypt.compare(password, getUserData.password)
        if (!password_compare) {
            return res.status(200).json({ error: "Please try to login with correct credentials" });
        }
        const auth_token = jwt.sign({ userid: getUserData.id, role: getUserData.role }, jwt_key);
        return res.status(200).json({ auth_token });
    } else {
        return res.status(200).json({ error: "No user found" });
    }
})
module.exports = router;