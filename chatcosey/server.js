const http = require('http');
var debug = require('debug')('chatcosey:server');

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.once('error', (err) => {
    console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected!");
});

// Bring in the models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");

const app = require("./app");
const port = '8888';

app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log("Server listening on port %d", port);
});
server.on('error', onError);
server.on('listening', onListening);

const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const jwt = require('jwt-then');
const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;
        next();
    } catch (err) {}
});

io.on("connection", (socket) => {
    console.log("Connected :" + socket.userId);

    socket.on("disconnect", () => {
        console.log("Disconnect :" + socket.userId);
    });

    socket.on("joinRoom", ({ chatroomId }) => {
        socket.join(chatroomId);
        console.log("A user joined chatroom :" + chatroomId);
    });

    socket.on("leaveRoom", ({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);
    });

    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
        if (message.trim().length > 0) {
            const user = await User.findOne({ _id: socket.userId });
            const newMessage = new Message({
                chatroom: chatroomId,
                user: socket.userId,
                message,
            });
            io.to(chatroomId).emit("newMessage", {
                message,
                name: user.name,
                userId: socket.userId
            });
            await newMessage.save();
        }
    });
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
    throw error;
    }

    var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
