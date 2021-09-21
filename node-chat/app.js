const express = require('express');
const socket = require('socket.io');
const http = require('http');

// Node.js 기본 내장 모듈
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

app.get('/', (req, res) => {
    fs.readFile('./static/index.html', (err, data) => {
        if (err) {
            res.send("Error");
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        }
    })
});

io.sockets.on('connection', (socket) => {
    // 새로운 유저가 접속했음을 다른 소켓 유저들에게 알려줌
    socket.on('newUser', (name) => {
        console.log(name + ' is connected');
        socket.name = name; // save name in socket
        io.sockets.emit('update', {
            type: 'connect',
            name: 'SERVER',
            message: name + 'is connected'
        });
    });

    // 서버에 전송한 메세지 받기
    socket.on('message', (data) => {
        data.name = socket.name;
        console.log(data);
        // 나머지 유저에게 메세지 전송
        socket.broadcast.emit('update', data);
    });

    // 접속 종료
    socket.on('disconnect', () => {
        console.log(socket.name + " is disconnected");
        // 나머지 유저에게 나갔다고 메시지 전송
        socket.broadcast.emit('update', {
            type: 'disconnect',
            name: 'SERVER',
            message: socket.name + 'is Connected'
        });
    });
});

server.listen(8080, () => {
    console.log('Server is Working Now');
});
