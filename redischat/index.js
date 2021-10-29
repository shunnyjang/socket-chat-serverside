const path = require('path');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
var io = require('socket.io')();

var redis = require('redis');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

const config = {
    host: process.env.HOST,
    port: process.env.PORT,
    password: process.env.PASSWORD
}

var store = redis.createClient(config); 
var pub = redis.createClient(config); 
var sub = redis.createClient(config);

sub.subscribe("chatting");

io.sockets.on('connection', function (client) {
    sub.on("message", function (channel, message) {
        console.log("message received on server from publish ");
        client.send(message);
    });
    client.on("message", function (msg) {
        console.log(msg);
        if(msg.type == "chat"){
            pub.publish("chatting",msg.message);
        } else if(msg.type == "setUsername") {
            pub.publish("chatting","A new user in connected:" + msg.user);
            store.sadd("onlineUsers",msg.user);
        }
    });
    client.on('disconnect', function () {
        sub.quit();
        pub.publish("chatting", "User is disconnected :" + client.id);
    });
});

const PORT = 3000 || process.env.PORT;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
