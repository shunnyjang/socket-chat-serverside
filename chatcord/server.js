const path = require('path');
const express = require('express');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', (socket) => {
    // console.log('New WS Connection...');

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome current user
        // Send a message to a single user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit(
            'message', 
            formatMessage(botName, `${user.username} has joined the chat`)
        );

        // Send users and room info
        io
        .to(user.room)
        .emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io
        .to(user.room)
        .emit(
            'message', 
            formatMessage(user.username, msg)
        );
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io
            .to(user.room)
            .emit(
                'message', 
                formatMessage(botName, `${user.username} has left the chat`)
            );
        }
    });
});

const PORT = 3000 || process.env.PORT;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
