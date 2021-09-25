const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");

const chatroomController = {
    createChatroom: async (req, res) => {
        const { name } = req.body;

        // const nameRegex = /^[A-Za-z\s]+$/;
        // if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets.";

        const chatroomExists = await Chatroom.findOne({ name });
        if (chatroomExists) throw "Chatroom with that name already exists!";

        const chatroom = new Chatroom({
            name
        });

        await chatroom.save();
        return res.json({
            message: "Chatroom created"
        });
    },
    getAllChatrooms: async (req, res) => {
        const chatrooms = await Chatroom.find({});
        return res.json(chatrooms);
    }
}

module.exports = chatroomController;
