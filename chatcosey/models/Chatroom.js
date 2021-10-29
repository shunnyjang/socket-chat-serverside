const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required",
    },
    participant: [{
        user: { 
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    }]
});

module.exports = mongoose.model("Chatroom", chatRoomSchema);
