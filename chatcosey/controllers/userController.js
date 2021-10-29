const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require('../modules/jwt');


const userController = {
    register: async (req, res) => {
        const {
            name,
            email,
            password
        } = req.body;

        const userExists = await User.findOne({
            email
        });
        if (userExists) throw "User with same email already exists.";
        
        const user = new User({
            name,
            email,
            password
        });
        await user.save();

        return res.json({
            message: "User [" + name + "] registered successfully!"
        });
    },
    login: async (req, res) => {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email,
            password
        });
        if (!user) throw "Email and Password did not match";

        const token = await jwt.sign(user);

        
        return res.json({
            message: "User logged in successfully!",
            token: token
        });
    },
    getAllUsers: async (req, res) => {
        const users = await User.find({ _id: { $ne: req.user.id }});
        return res.status(200).json(users);
    }
}

module.exports = userController;
