const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require('../modules/jwt');

const userController = {
    signup: async (res, req) => {
        const {
            name,
            email,
            password
        } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({
            message: "이미 등록된 이메일입니다."
        })

        const user = new User({
            name,
            email,
            password
        });
        await user.save();

        return res.status(201).json({
            message: `${name}님이 성공적으로 등록됐습니다`
        });
    },
    signin: async (req, res) => {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email,
            password
        })
        if (!user) return res.status(400).json({
            message: "이메일 또는 비밀번호가 틀립니다"
        });
        const token = jwt.sign(user);
        return res.status(201).json({
            message: "성공적으로 로그인했습니다",
            token
        });
    }
}

module.exports = userController;
