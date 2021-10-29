const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

const chatroomController = {
    createChatroom: async (req, res) => {
        const { name } = req.body;
        const chatroomExists = await Chatroom.findOne({ name });
        if (chatroomExists) return res.status(400).json({
            message: "이미 존재하는 채팅방 이름입니다"
        });

        const chatroom = new Chatroom({ name });
        await chatroom.save();
        return res.status(201).json({
            message: "Chatroom created"
        });
    },
    getAllChatrooms: async (req, res) => {
        const chatrooms = await Chatroom.find({});
        return res.json(chatrooms);
    }
}

module.exports = chatroomController;
