const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

const chatroomController = {
    createChatroom: async (req, res) => {
        const user = req.user.id;
        const { name, recipient } = req.body;

        const chatroom = new Chatroom({
            name,
            participant: [{ user: user }, { user: recipient }]
        });

        await chatroom.save();
        return res.status(201).json({
            message: "Chatroom created",
            chatroom_id: chatroom._id
        });
    },
    getAllMyChatrooms: async (req, res) => {
        try {
            const chatrooms = await Chatroom.find({ participant: { user: req.user.id } }).populate("participant.user");
            return res.status(200).json(chatrooms)
        } catch (e) { 
            console.log(e);
            return res.status(400).json({
                "message": "Error"
            })
        }
    }
}

module.exports = chatroomController;
