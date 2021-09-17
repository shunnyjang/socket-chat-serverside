# socket-chat-serverside
node.js socket serverside toy project with noonnoo

# Node.js Socket.IO
https://socket.io/docs 번역입니다.
수많은 오역과 의역 😉

## Index
### [Socket.IO가 뭔가요?](#Socket.IO가-뭔가요?)
- [Installation](#Installation)
- [Initialization](#Initialization)
  - [Standalone](#Standalone)
  - [기존 HTTP 서버에 붙여서 초기화](#기존-HTTP-서버에-붙여서-초기화)
  - [Express에 초기화](#Express에-초기화)
- [Options](#Options)
  - [Low-level engine options](#Low-level-engine-options)

### [The Server Instance](#The-Server-Instance)
- [Server#engine](#Server#engine)
- [Utility methods](#Utility-methods)
  - [socketsJoin](#socketsJoin)
  - [socketsLeave](#socketsLeave)
  - [disconnectSockets](#disconnectSockets)
  - [fetchSockets](#fetchSockets)
  - [serverSideEmit](#serverSideEmit)
- [Events](#Events)

### [Server API](#Server-API)
- [new Server(httpsServer[, options])](#new-Server(httpsServer[,-options]))
- [new Server(port[, options])](#new-Server(port[,-options]))
- [new Server(options)](#new-Server(options))
  - [server.sockets](#server.sockets)
  - [server.serveClient([value])](#server.serveClient([value]))
  - [server.path([value])](#server.path([value]))
---



# Socket.IO가 뭔가요?
`Socket.IO`는 **실시간**, **양방향**, 브라우저와 서버 간에 **이벤트 기반** 커뮤니케이션을 가능하게 해주는 라이브러리에요.

- **Node.js 서버**
- 브라우저용 **Javascript 클라이언트** 라이브러리 또는 **node.js 클라이언트**

로 구성됩니다. 그리고 아래 다른 언어의 클라이언트들도 할 수 있어요

- Java
- C++
- Swift
- Dart
- Python
- .Net
- Golang
- Rust


# Installation
```
npm install socket.io
```

# Initialization

## Standalone

```javascript
const io = require('socket.io')(options);

io.on('connection', (socket) => {
    /* ... */
});
io.listen(3000);
```

인자에 포트를 바로 넣어주고 싶다면

```javascript
const options = { /* ... */ };
const io = require('socket.io')(3000, options;

io.on('connection', (socket) => {
    /* ... */
});
```

## 기존 HTTP 서버에 붙여서 초기화

- **HTTP** 서버

```javascript
const httpServer = require('http').createServer();
const options = { /* ... */ };
const io = require('socket.io')(httpServer, options);

io.on('connection', (socket) => {
    /* ... */
});
httpServer.listen(3000);
```

- **HTTPS** 서버

```javascript
const fs = require('fs');
const httpServer = require('https').createServer({
    key: fs.readFileSync('/tmp/key.pem'),
    cert: fs.readFilesync('/tmp/cert.pem')
});
const options = { /* ... */ };
const io = require('socket.io')(httpServer, options);

io.on('connection', (socket) => {
    /* ... */
});
httpServer.listen(3000);
```

- **HTTP/2** 서버

```javascript
const fs = require('fs');
const httpServer = require('http2').createSecureServer({
  allowHTTP1: true,
  key: fs.readFileSync('/tmp/key.pem'),
  cert: fs.readFileSync('/tmp/cert.pem')
});
const options = { /* ... */ };
const io = require('socket.io')(httpServer, options);

io.on('connection', socket => { /* ... */ });
httpServer.listen(3000);
```

## Express에 초기화

```javascript
const app = require('express')();
const httpServer = require('http').createServer(app);
const options = { /* ... */ };
const io = require('socket.io')(server, options) ;

io.on('connection', (socket) => {
    // ...
});
httpServer.listen(3000);
// WARNING !!! app.listen(3000); will not work here, as it creates a new HTTP server
```

# Options

```javascript
const options = {
    path: '/test',
    serveClient: false,
    // 아래는 engine.IO 옵션
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
};
```

1. `path`
  - default value : `/socket.io/`

서버와 클라이언트가 반드시 같아야 합니다

**서버**
```javascript
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    path: '/my-custom-path/'
})
```

**클라이언트**
```typescript
import { io } from 'socket.io-client';
const socket = io('https://example.com', {
    path: '/my-custom-path/'
});
```

2. `serveClient`
클라이언트 파일을 보낼지에 대한 옵션입니다. `true`면 다음 위치에서 번들이 제공됩니다.

  - default value : `true`
  - `<url>/socket.io/socket.io.js`
  - `<url>/socket.io/socket.io.min.js`
  - `<url>/socket.io/socket.io.msgpack.min.js`

3. `adapter`
Redis 어댑터를 쓴다면 예시는 아래와 같습니다 (`socket.io-redis` 패키지를 사용합니다)

  - default value : `socket.io-adapter` (인메모리 어댑터입니다)

```javascript
const httpServer = require('http').createServer();
const redisClient = require('redis').createClient();
const io = require('socket.io')(httpServer, {
    adapter: require('socket.io-redis')({
        pubClient: redisClient,
        subClient: redisClient.duplicate()
    })
});
```

4. `parser`

  - default value : `socket.io-parser`

5. `connectTimeout`
namespace에 접속이 안되면 접속시도가 끊어지는 ms

  - default value : `45000`

### Low-level engine options

6. `pintTimeout`

서버와 클라이언트의 연결이 죽지 않고 잘 살아있는지 간헐적으로 확인하는 `하트비트 매카니즘`에 이용됩니다. 

  - default value : `20000`

1. 서버에서 핑을 보냈는데 클라이언트가 `pintTimeout` 시간내에 퐁을 보내지 않는다면 서버는 연결이 끊어졌다고 간주합니다.
2. 클라이언트가 `pingInterval + pingTimeout` 시간 내에 핑을 받지 못하면 클라이언트는 연결이 끊어졌다고 간주합니다.


이 두 경우에 연결이 끊어진(disconnection) 이유(reason)는 `ping timeout`이 됩니다

```javascript
socket.on('disconnect', (reason) => {
    console.log(reason);
    // "ping timeout"
});
```

**기억해두세요!** : 어플리케이션에서 큰 파일을 전송하면 기본값이 부족할 수 있어요. 큰 파일을 보내는 경우에는 `pingTimeout` 설정을 올려두세요

```javascript
const io = require('socket.io')(httpServer, {
    pingTimeout: 30000
});
```

7. `pingInterval`

`pingTimeout`에서 클라이언트가 서버의 핑을 기다리는데 필요한 추가 시간

  - default value : `25000`

8. `upgradeTimeout`

완료되지 않은 전송 업그레이드가 취소되기 전 지연시간 (ms)

  - default value : `10000`

9. `maxHttpBufferSize`

소켓이 닫히기 전까지 한 메세지에 몇 바이트까지 가능한건지 정의합니다. 필요에 따라서 값을 조절하세요.

  - default value : `1e6` (1MB)

```javascript
const io = require('socket.io')(httpServer, {
    maxHttpBufferSize: 1e8
});
```

10. `allowRequest`

주어진 핸드셰이크 또는 업그레이드 요청을 첫 번째 매개 변수로 수신받고, 핸드셰이크를 계속할지 결정하는 함수

  - `default` : -

```javascript
const io = require('socket.io')(httpServer, {
    allowRequest: (req, callback) => {
        const isOriginValid = check(req);
        callback(null, isOriginValid);
    }
});
```

11. `transport`

서버 사이드에서 허용되는 low-level 전송입니다.

  - default value : `['polling', 'websocket']`

12. `allowUpgrades`

전송 업그레이드를 허용할지 옵션입니다.

  - default value : `true`

13. `cookie`

Socket.IO v3부터 쿠키는 기본으로 제공되지 않음

  - default value : `-`

```javascript
const io = require('socket.io')(httpServer, {
    cookie: {
        name: 'my-cookie',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 86400
    }
});
```

# The Server Instance

코드에서 주로 `io`로 선언되는 서버 인스턴스는 어플리케이션에서 사용되는 몇 개의 속성이 있습니다.

서버 인스턴스는 메인 네임스페이스의 메소드를 상속합니다. (예 : `namespace.use()`, `namespace.allSockets()`)

## Server#engine

기존 Engine.IO 서버를 참조합니다.
현재 연결된 많은 개수의 클라이언트를 가지고 오는데 사용할 수 있습니다.

```javascript
const count = io.engine.clientCount;
// count : 사용량에 따라 메인 네임스페이스의 소켓 인스턴스 수와 유사할 수도 있고 유사하지 않을 수도 있어요
const count2 = io.of('/').sockets.size;
```

또는 커스텀한 세션 ID를 생성할 수 있습니다. (`sid` 쿼리 파라미터)

```javascript
const uuid = require('uuid');
io.engine.generateId = (req) => {
    return uuid.v4(); // 모든 Socket.IO 서버를 통틀어서 유니크한 값이어야 합니다
}
```

`socket.io@4.1.0`에 따라 Engine.IO 서버는 세 가지 특별한 이벤트를 발생시킵니다.

 - `initial_headers` : 가장 첫번째 HTTP 세션 요청(=핸드셰이크)의 응답 헤더가 만들어지기 전에 발생합니다. 아래와 같이 커스터마이징 할 수 있어요
    ```javascript
    io.engine.on('initiali_headers', (headers, req) => {
        headers['test'] = '123';
        headers['set-cookie'] = 'mycookie=456';
    });
    ```
 - `headers` : WebSocket 업그레이드를 포함한 모든 HTTP 세션 요청의 응답 헤더가 만들어지기 전에 발생됩니다. 아래와 같이 커스터마이징 할 수 있어요.
    ```javascript
    io.engine.on('headers', (headers, req) => {
        headers['test'] = '789';
    });
    ```
 - `connection_error` : 연결이 비정상적으로 끊어질 때 발생됩니다.
    ```javascript
    io.engine.on('connection_error', (err) => {
        console.log(err.req);      // the request object
        console.log(err.code);     // the error code, for example 1
        console.log(err.message);  // the error message, for example "Session ID unknown"
        console.log(err.context);  // some additional error context
    })
    ```
    아래는 발생할 수 있는 에러 코드와 메세지에요
    |Code|Message|
    |----|-------|
    |0|"Transport unknown"|
    |1|"Session ID unknown"|
    |2|"Bad handshake method"
    |3|"Bad request"|
    |4|"Forbidden"|
    |5|"Unsupported protocol version"|

## Utility methods
소켓 인스턴스와 그 room들을 다룰 수 있는 유틸리티 메소드가 Socket.IO v4.0.0에 추가되었습니다.

- `socketsJoin` : 일치하는 소켓 인스턴스가 특정 채팅방에 들어갈 수 있도록 해줘요
- `socketsLeave` : 일치하는 소켓 인스턴스가 특정 채팅방에서 나오도록 해줘요
- `disconnectSockets` : 일치하는 소켓 인스턴스의 연결을 끊어요
- `fetchSockets` : 일치하는 소켓 인스턴스를 반환해줘요

`serverSideEmit` 메소드가 Socket.IO v4.1.0에 추가되었습니다.

이 메소드들은 브로드캐스팅과 같은 의미(semantics)를 가지며 같은 필터가 적용됩니다

```javascript
io.of('/admin').in('room1').except('room2').local.disconnectionSockets();
// 참고
// - namespace : admin
// - room : roo1, roo2
```

위 코드는 admin 네임스페이스의 모든 소켓 인스턴스들 중
 - room1 안에 있고 (`in('room1')` 또는 `to('room1')`)
 - room2에 있는 소켓들을 제외하고 (`except('room2')`)
 - 오직 현재 Socket.IO 서버에 있는 (`local`)
인스턴스들의 연결을 끊어줍니다.

`socket.io-redis@6.1.0`부터 Redis 어댑터와 호환됩니다. 어댑터는 Socket.IO 서버들을 아울러서 적용돼요.

### `socketsJoin`

이 메소드는 소켓 인스턴스들이 특정 room에 들어갈 수 있도록 해줍니다.

```javascript
// 모든 소켓 인스턴스들이 "room1"에 들어가게 해요
io.socketsJoin('room1');

// room1에 있는 모든 소켓 인스턴스들이 room2와 room3에 들어가게 해요
io.in('room1').socketsJoin(['room2', 'room3']);

// 'admin' 네임스페이스의 room1에 있는 모든 소켓 인스턴스들이 room2에 들어가게 해요
io.of('/admin').in('room1').socketsJoin('room2');

// 하나의 소켓 아이디로도 할 수 있어요
io.in(theSocketId).socketsJoin('room1');
```

### `socketsLeave`

이 메소드는 소켓 인스턴스들이 특정 room에서 나오게 합니다.

```javascript
// 모든 소켓 인스턴스들이 room1에서 나오게 해요
io.socketsLeave('room1');

// room1에 있는 모든 소켓 인스턴스들이 room2와 room3에서 나오게 해요
io.in('room1').socketsLeave(['room2', 'room3']);

// admin 네임스페이스의 room1에 있는 모든 소켓 인스턴스들이 room2에서 나오게 해요
io.of('/admin').in('room1').socketsLeave('room2');

// 하나의 소켓 아이디로도 할 수 있어요
io.in(theSocketId).socketsLeave('room1');
```

### `disconnectSockets`

이 메소드는 소켓 인스턴스들의 연결을 끊어줍니다.

```javascript
// 모든 소켓 인스턴스들의 연결을 끊어요
io.disconnectSockets();

// room1에 있는 모든 소켓 인스턴스들의 연결을 끊어요 (그리고 저수준 연결을 버려줘요)
io.in('room1').disconnectSockets(true);

// admin 네임스페이스의 room1에 있는 모든 소켓 인스턴스들의 연결을 끊어요
io.of('/admin').in('room1').disconnectSockets();

// 하나의 소켓 아이디로도 할 수 있어요
io.of('/admin').in(theSocketId).disconnectSockets();
```

### `fetchSockets`

이 메소드는 소켓 인스턴스들을 반환해줍니다.

```javascript
// 모든 소켓 인스턴스들을 반환해요.
const sockets = await io.fetchSockets();

// 메인 네임스페이스의 room1의 모든 소켓 인스턴스들을 반환해요
const sockets = await io.in('room1').fetchSockets();

// admin 네임스페이스의 room1의 모든 소켓 인스턴스들을 반환해요
const sockets = await io.of('/admin').in('room1').fetchSockets();

// 하나의 소켓 아이디로도 할 수 있어요
const sockets = await io.in(theSocketId).fetchSockets();
```
위 코드의 `소켓` 변수들은 일반적인 소켓 클래스의 하위 집합을 갖는 객체들의 리스트입니다.

```javascript
for (const socket of sockets) {
    console.log(socket.id);
    console.log(socket.handshake);
    console.log(socket.rooms);
    console.log(socket.data);
    socket.emit(/* ... */);
    socket.join(/* ... */);
    socket.leave(/* ... */);
    socket.disconnect(/* ... */);
}
```

이 `데이터` 속성은 Socket.IO 서버들간에 정보를 공유하는데 쓸 수 있는 임의의 객체입니다.

```javascript
// 서버 A
io.on('connection', (socket) => {
    socket.data.username = 'alice';
});

// 서버 B
const sockets = await io.fetchSockets();
console.log(sockets[0].data.username); // 'alice'
```

### `serverSideEmit`

이 메소드는 멀티-서버-환경(=여러개의 노드들을 사용하는 경우) Socket.IO 서버 클러스터의 다른 서버에 이벤트를 보냅니다(emit). 

문법:

```javascript
io.serverSideEmit('hello', 'world');
```

받는(receive) 쪽에서의 문법은:

```javascript
io.on('hello', (arg1) => {
    console.log(arg1); // prints 'world'
});
```
핑퐁 확인(Acknowledgements)도 가능합니다:
```javascript
// 서버 A
io.serverSideEmit('ping', (err, responses) => {
    console.log(responses[0]); // prints 'pong'
});

// 서버 B
io.on('ping', (cb) => {
    cb('pong');
});
```

알아두세요:
- `connection`, `connect`, `new_namespace`는 예약어라서 사용 불가능합니다
- 속성(argument)의 개수는 몇 개여도 상관없어요. 하지만 바이너리 구조는 현재 지원되지 않습니다. (속성의 배열은 `JSON.stringify` 형태입니다)

예:
```javascript
io.serverSideEmit('hello', 'world', 1, '2', {3: '4'});
```

- 확인 콜백은 다른 Socket.IO 서버들이 지연 시간 내에도 반응하지 않으면 에러가 불려집니다.
```javascript
io.serverSideEmit('ping', (err, responses) => {
    if (err) {
        // Socket.IO 서버 중 하나라도 응답하지 않아도
        // 'response' 배열은 이미 수신된 모든 응답을 포함합니다.
    } else {
        // 성공! 'responses' 배열은 Socket.IO 클러스터의 각각의 서버들의 객체를 하나씩 포함합니다.
    }
})
```

## Events

서버 인스턴스는 하나의 이벤트를 보냅니다(emit). (기술적으로는 두 개이지만 ^^ `connect`는 `connection`의 또 다른 이름이에요)
- `connection`

### `connection`
```javascript
io.on('connection', (socket) => {
    // ...
});
```

# Server API
`require('socket.io')`로 이용됩니다.

# Server

## new Server(httpsServer[, options])
- `httpServer` (*http.Server*) 연결할 서버
- `options` (*Object*)

`new` 선언으로도 할 수 있고
```javascript
const { Server } = require('socket.io');
const io = new Server();
```

선언없이 할 수도 있어요
```javascript
const io = require('socket.io')();
```

이용가능한 [옵션](#Options)은 참고하세요!

## new Server(port[, options])
- `port` (*숫자*) : 연결할(listen) 포트의 번호 (새로운 `http.Server`가 만들어져요)
- `options` (*Object*)

이용가능한 [옵션](#Options)은 참고하세요!
```javascript
const io = require('socket.io')(3000, {
  path: '/test',
  serveClient: false,
  // 아래는 engine.IO 옵션들
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
```

## new Server(options)
- `options` (Object)

이용가능한 [옵션](#Options)은 참고하세요!

```javascript
const io = require('socket.io')({
  path: '/test',
  serveClient: false,
});
```

그리고 아래처럼 하거나
```javascript
const server = require('http').createServer();

io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3000);
```

아래처럼 할 수 있어요
```javascript
io.attach(3000, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});
```

### server.sockets
- (*네임스페이스*)

기본 네임스페이스 별칭은 `/` 입니다.
```javascript
io.sockets.emit('hi', 'everyone');
```

아래도 동일하게 작동하는 코드에요
```javascript
io.of('/').emit('hi', 'everyone');
```

### server.serveClient([value])
- `value` (*Boolean*)
- **Returns** `Server | Boolean`

만약 `value`가 `true`면 연결된 서버는 클라이언트 파일들을 보내줍니다. (연결된 서버는 `Serve#attach`를 보세요.) 이 메소드는 `attach`메소드가 불리고 난 후에는 효력이 없습니다. 만약 아무 인수도 받지 못하면 이 메소드는 현재 값을 반환합니다.
```javascript
// 서버와 `serveClient` 옵션을 보내요
const io = require('socket.io')(http, {
  serveClient: false
});

// 또는 서버를 보내지 않고 메소드를 부를 수 있어요
const io = require('socket.io')();
io.serveClient(false);
io.attach(http);
```

### server.path([value])
- `value` (*Boolean*)
- **Returns** `Server | Boolean`

`engine.io` 아래 있는 경로`값`을 설정하고 정적 파일들이 보내집니다. 기본값은 `/socket.io` 입니다. 만약 아무 인수도 받지 못하면 현재 값을 반환합니다.

```javascript
const io = require('socket.io')();
io.path('/myownpath');

// 클라이언트에서는
const socket = io({
  path: 'myownpath'
});
```

### server.adapter([value])
- `value` (*Adapter*)
- **Returns** `Server | Adapter`

어댑터 `값`을 설정합니다. 기본값은 메모리 기반인 socket.io를 전달해주는 `어댑터`의 인스턴스입니다. [socket.io-adapter](https://github.com/socketio/socket.io-adapter)를 참고하세요. 만약 아무 인수도 받지 못하면 이 메소드는 현재값을 반환합니다.

```javascript
const io = require('socket.io')(3000);
const redis = require('socket.io-redis');
io.adapter(redis({
  host: 'localhost',
  port: 6379
}));
```

### server.attach(httpServer[, options])
- `httpServer` (*httpServer*) 연결되는 서버
- `options` (*Object*)

`httpServer`의 engine.io 인스턴스에 `서버`를 연결합니다. `옵션`이 제공되기도 해요.

### server.attach(port[, options])
- `port` (*Number*) 연결할 수 있도록 열어 둔 포트 번호
- `options` (*Object*)

새로운 http.Server의 engine.io 인스턴스에 `서버`를 연결합니다. `옵션`이 제공되기도 해요.

### server.listen(httpServer[, options])
[server.attach(httpServer[, options])](#server.attach(httpServer[,-options])) 와 동일해요

### server.listen(port[, options])
[server.attach(port[, options])](#server.attach(port[,-options])) 와 동일해요

### server.bind(engine)
- `engine` (*engine.Server*)
- **Returns** `Server`

### server.onconnection(socket)
- `socket` (*engine.Socket*)
- **Returns** `Server`

### server.of(nsp)
- `nsp` (*String|RegExp|Function*)
- **Returns** `Namespace`

경로 이름 식별자인 `nsp`를 기준으로 지정된 네임스페이스를 초기화하고 검색합니다. 만약 네임스페이스가 이미 초기화되어 있으면 즉시 그 네임스페이스를 반환합니다.

```javascript
const adminNamespace = io.of('/admin');
```

다이나믹한 방법으로 네임스페이스를 만들기 위해 정규식이나 함수가 주어질 수 있습니다.
정규식이 주어지는 방법은:
```javascript
const dynamicNsp = io.of(/^\/dynamic-\d+$/).on('connection', (socket) => {
  const newNamespace = socket.nsp; // newNamespace.name === "/dynamic-101"

  // 하위 네임스페이스에 있는 모든 클라이언트에게 브로드캐스트
  newNamespcae.emit('hello');
});

// client-side
const socket = io('/dynamic-101');

// 각각의 하위 네임스페이스에 있는 모든 클라이언트에게 브로드캐스트
dynamicNsp.emit('hello');

// 각각의 하위 네임스페이스에 미들웨어 추가
dynamicNsp.use((socket, next) => {
  /* ... */
});
```

함수가 주어지는 방법은:
```javascript
io.of((name, query, next) => {
  // checkToken 메소드는 반드시 Boolean으로 반환되고, 클라이언트가 연결될 수 있는지를 알려줘요
  next(null, checkToken(query.token));
}).on('connection', (socket) => {
  /* ... */
});
```

### server.close([callback])
- `callback` (*Function*)
Socket.IO 서버를 닫습니다. `callback` 인수는 선택적이며 연결이 닫히면 불려집니다.
기억하세요 : 이 메소드는 HTTP 서버도 닫습니다.

```javascript
const Server = require('socket.io');
const PORT = 3030;
const server = require('http').Server();

const io = Server(PORT);
io.close(); // 현재 서버를 닫습니다

server.listen(PORT);
io = Server(server);
```

### server.engine
[Engine.IO 서버](#https://socket.io/docs/v4/server-api/#engine)를 참조하세요.

### server.socketsJoin(rooms)
v4.0.0에 추가된 메소드입니다.
`io.of('/').socketsJoin(rooms)`의 별칭입니다.
[여기](#socketsJoin)를 참고하세요.

### server.disconnectSockets([close])
v4.0.0에 추가된 메소드입니다.
`io.of('/').disconnectSockets(rooms)`의 별칭입니다.
[여기](#disconnectSockets)를 참고하세요.

### server.fetchSockets()
v4.0.0에 추가된 메소드입니다.
[여기](#fetchSockets)를 참고하세요

### server.serverSideEmit(eventName[, ...args][, ack])
v4.0.0에 추가된 메소드입니다.
`io.of("/").serverSideEmit(/* ... */);`와 같습니다.
[여기](#serverSideEmit)를 참고하세요.

### Event

- `connection` : 클라이언트와의 연결에 따라 발생합니다.
  - `socket` (*Socket*) : 클라이언트와의 소켓 연결
  ```javascript
  io.on('connection', (socket) => {
    // ...
  });
  ```
- `connect` : `connection`과 동의이 (synonym)
- `new_namespace` : 새로운 네임스페이스가 만들어지면 발생합니다.
  - `namespace` (*Namespace*) : 새로운 네임스페이스
  
  ```javascript
  io.on('new_namespace', (namespace) => {
    // ...
  });
  ```
  
  다음 예시들처럼 사용할 수 있습니다.
  - 각각 네임스페이스에 미들웨어를 붙일 때 :
  ```javascript
  io.on('new_namespace', (namespace) => {
    namespace.use(myMiddleware);
  });
  ```
  
  - 동적으로 생성된 네임스페이스를 추적할 때 :
  ```javascript
  io.of(/\/nsp-\w+/);

  io.on('new_namespace', (namespace) => {
    console.log(namespace.name);
  })
  ```

## Namespace
네임스페이스는 경로명으로 식별되는 주어진 영역(scope) 내에 연결된 소켓들의 풀을 나타냅니다.
(eg: `/chat`)
더 많은 정보는 [여기](#The-Server-instance)를 확인하세요

### namespace.name
- (**String**)
네임스페이스의 식별자 속성입니다.

### namespace.sockets
- (*Map<SocketId, Socket>*)

이 네임스페이스에 연결되는 소켓 인스턴스들의 맵입니다.

```javascript
// (이 노드에 있는) 이 네임스페이스의 소켓 개수
const socketCount = io.of('/admin').sockets.size;
```

### namespace.adapter
- (*Adapter*)
어댑터는 네임스페이스에 쓰입니다. Redis에 기반한 어댑터를 쓸 때 유용하며, 클러스터들을 아울러 소켓과 room을 관리하는 메소드가 발생됩니다.

기억해두세요: 메인 네임스페이스의 어댑터는 `io.of('/').adapter`에 액세스할 수 있습니다.
자세한 설명은 [여기](#https://socket.io/docs/v4/rooms/#Implementation-details)를 참고하세요.

### namespace.to(room)
- `room` (*string*) | (*string[]*)
- **Returns** `BroadcastOperator` for chaning

이 메소드는 해당 `room`에 들어와있는 클라이언트에게만 *브로드캐스팅*되는 후속으로 발생되는 이벤트의 수식어(modifier)를 설정합니다. 

여러 room에 보내고 싶으면, `to`를 여러 번 호출할 수 있습니다.
```javascript
const io = require('socket.io')();
const adminNamespace = io.of('/admin');

adminNamespace.to('level1').emit('an event', {
  some: 'data'
});

// 여러 room
io.to('room1').to('room2').emit(...);
// 또는 하나의 배열로도 가능해요
io.to(['room1', 'room2']).emit(...);
```

### namespace.in(room)
v1.0.0에 추가된 메소드입니다.
[namespace.to(room)](#namespace.to(room))와 동일해요.

### namespace.except(rooms)
v4.0.0에 추가된 메소드입니다.
- `rooms` (*string*) | (*string[]*)
- **Returns** `BroadcastOperator`
이 메소드는 해당 `room`에 있지 **않는** 클라이언트에게만 *브로드캐스팅*되는 후속으로 발생되는 이벤트의 수식어(modifier)를 설정합니다. 

```javascript
// 'room1'에 있는 클라이언트를 제외하고 보내요
io.except('room1').emit(...);

// room2에 있고 room3에 있지 않은 모든 클라이언트에게 보내요
io.to('room2').except('room3').emit(...);
```

### namespace.emit(eventName[,...args])
- `eventName` (*String*)
- `args`
- **Returns** `true`

연결된 모든 클라이언트에게 발송합니다. 아래 두 코드는 동일하게 작동해요.
```javascript
const io = require('socket.io')();
io.emit('an event sent to all connected clients'); // 메인 네임스페이스

const chat = io.of('/chat');
chat.emit('an event sent to all connected clients in chat namespace');
```

**기억해두세요**: 네임스페이스에서 발송할 때는 확인(acknowledgements)이 지원되지 않아요.

### namespace.allSockets()
- **Returns** `Promise<Set<SocketId>>`

(적용가능한 모든 노드를 통틀어서) 이 네임스페이스에 연결된 소켓들의 아이디 리스트를 알 수 있습니다.
```javascript
// 메인 네임스페이스에 있는 모든 소켓들
const ids = await io.allSockets();

// 메인 네임스페이스 안 'user:1234' room에 있는 모든 소켓들
const ids = await io.in('user1234').allSockets();

// 'chat' 네임스페이스에 있는 모든 소켓들
const ids = await io.of('/chat').allSockets();

// 'chat' 네임스페이스에 있는 'general' room에 있는 모든 소켓들
const ids = await io.of('/chat').in('general').allSockets();
```

### namespace.use(fn)
- `fn` (*Function*)

들어오는 모든 `소켓`에 실행되는 함수인 미들웨어를 등록합니다. 그리고 다음으로 등록된 미들웨어에 대해 선택적으로 실행을 연기할 수 있는 소켓과 함수를 파라미터로 수신합니다.

미들웨어 콜백으로 보내진 에러들은 클라이언트에게 특별한 `connect_error` 패킷으로 보내집니다.

```javascript
// server-side
io.use((socekt, next) => {
  const err = new Error('not authorized');
  err.data = { content: "Please retry later" }; // 세부사항 추가
  next(err);
});

// client-side
socket.on('connect_error', (err) => {
  console.log(err, instanceof Error); // true
  console.log(err.message); // not authorized
  console.log(err.data); // { content: "Please retry later" }
});
```

자세한 내용은 [여기](https://socket.io/docs/v4/middlewares/)를 확인하세요

### namespace.socketsJoin(rooms)
v4.0.0에 추가된 메소드입니다.
- `rooms` (*String*) | (*String[]*)
- **Returns** `void`

이 메소드는 소켓 인스턴스들이 특정 room에 들어갈 수 있도록 해줍니다.
```javascript
// 모든 소켓 인스턴스들이 "room1"에 들어가게 해요
io.socketsJoin('room1');

// room1에 있는 모든 소켓 인스턴스들이 room2와 room3에 들어가게 해요
io.in('room1').socketsJoin(['room2', 'room3']);

// 'admin' 네임스페이스의 room1에 있는 모든 소켓 인스턴스들이 room2에 들어가게 해요
io.of('/admin').in('room1').socketsJoin('room2');

// 하나의 소켓 아이디로도 할 수 있어요
io.in(theSocketId).socketsJoin('room1');
```

더 많은 정보는 [여기](#socketsJoin)를 확인하세요.

### namespace.socketsLeave(rooms)
- `rooms`(*string*) | (*string[]*)
- **Returns** `void`

더 많은 정보는 [여기](#socketsLeave)를 확인하세요

### namespace.disconnectSockets([close])
- `close` (*Boolean*) 연결을 닫을지 말지 여부
- **Returns** `void`

더 많은 정보는 [여기](#disconnectSockets)를 확인하세요.

### namespace.fetchSockets()
- **Returns** `(Socket | RemoteSocket)[]`

**꼭! 기억해두세요** : 이 메소드는 (그리고 `socketsJoin`, `socketsLeave`, `disconnectSockets`도) Redis 어댑터와 호환돼요. (`socket.io-redis@6.1.0`부터). 즉 이 메소드들은 Socket.IO 서버를 아울러서 모두 작동해요.

더 많은 정보는 [여기](#fetchSockets)를 확인하세요

### namespace.serverSideEmit(eventName[,...args][,ack])
- `eventName` (*String*)
- `args`
- `ack` (*Function*)
- **Returns** `true`

더 많은 정보는 [여기](#serverSideEmit)를 확인하세요

## Socket

`소켓`은 브라우저 클라이언트와 상호작용하기 위한 구조적인 클래스입니다. `소켓`은 특정 네임스페이스에 속하고 (네임스페이스 기본값은 `/`) `클라이언트`를 사용하여 통신합니다.

`소켓`은 실제 TCP/IP `소켓`에 직접적으로 관련있지 않으며 그저 클래스의 이름입니다.

각각의 `네임스페이스` 내에서, `room`이라고 부르는 임의적인 채널을 정의할 수 있고 `소켓은` 이 채널에 들어왔다 나갈 수 있습니다. 이 채널은 `소켓` 집단에 브로드캐스트를 쉽게 만듭니다. (아래 `Socket#to`를 참고하세요!)

`소켓` 클래스는 EventEmitter를 상속합니다. `소켓` 클래스는 오직 `emit` 메소드를 오버라이딩하고 EventEmitter의 다른 메소드는 수정하지 않았습니다. 여기 적혀진 (`emit`을 제외한) 모든 메소드는 `EventEmitter`에 의해 구현됐고, `EventEmitter`의 설명이 같이 적용됩니다.

더 많은 정보는 [여기](https://socket.io/docs/v4/server-socket-instance/)를 참고하세요.


### socket.id
- (*String*)

세션의 유니크한 식별자이며 클라이언트로부터 받습니다.

### socket.rooms
- (*Set*)

클라이언트가 있는 room을 식별하는 문자열의 집합입니다.

```javascript
io.on('connection', (socket) => {
  console.log(socket.rooms); // Set { <socket.id> }
  socket.join('room1');
  console.log(socket.rooms); // Set { <socket.id>, 'room1' }
});
```

### socket.client
- (*Client*)

클라이언트 객체를 참고합니다.

### socket.conn
- (*engine.Socket*)

클라이언트 전송 연결을 참조합니다. (engine.io `소켓` 객체) 이 메소드는 여전히 대부분의 실제 TCP/IP 소켓을 추상화해주는 IO의 전송 레이어(transport layer)에 접근할 수 있도록 해줍니다.

```javascript
io.on('connection', (socket) => {
  const transport = socket.conn.transport.name; // (예:) 'polling'
  console.log('current transport', transport);

  socket.conn.on('upgrade', () => {
    const newTransport = socket.conn.transport.name; // (예:) 'websocket'
    console.log('new transport', newTransport);
  });
});
```

### socket.request
- (*Request*)

engine.io `클라이언트`를 만든 `요청`을 참조하는 프록시를 얻을 수 있습니다. `Cookie`나 `User-Agent`와 같은 요청 헤더에 접근하는데 유용합니다.

```javascript
const cookie = require('cookie');
io.on('connection', (socket) => {
  const cookies = cookie.parse(socket.request.headers.cokie || "");
});
```

### socket.handshake
- (*Object*)

핸드셰이크 구성사항:
```javascript
{
  headers: /* 핸드셰이크 일부로 보내진 헤더 */,
  time: /* 만들어진 일시 (문자열 형태) */,
  address: /* 클라이언트 ip주소 */,
  xdomain: /* 요청이 CORS인지 */,
  secure: /* 요청이 보안이 되어있는지 */,
  issued: /* 만들어진 일시 (유닉스 타임스탬프 형태) */,
  url: /* 요청 URL 문자열 */,
  query: /* 첫 번째 요청의 쿼리 파라미터 */,
  auth: /* 인증 페이로드 */,
}
```

사용하는법:
```javascript
io.use((socket, next) => {
  let handshake = socket.handshake;
  // ...
});

io.on('connection', (socket) => {
  let handshake = socket.handshake;
  // ...
});
```

### socket.use(fn)
- `fn` (*Function*)

들어오는 모든 `패킷`에서 실행되는 함수인 미들웨어를 등록하고 파라미터로서 받습니다. 그리고 다음으로 등록되는 미들웨어 실행을 선택적으로 연기하는 함수를 실행합니다.

미들웨어 콜백으로 불려지는 에러들은 서버 측에서 `error` 이벤트로 발생됩니다.

```javascript
io.on('connection', (socket) => {
  socket.use(([event, ...args], next) => {
    if (isUnauthorized(event)) {
      return next(new Error('unauthorized event'));
    }
    // next()를 부르는 걸 절대 잊지마세요!
    next();
  });

  socket.on('error', (err) => {
    if (err && err.message === 'unauthorized event') {
      socket.disconnect();
    }
  });
});
```

### socket.send([...args][,ack])
- `args`
- `ack` (*Function*)
- **Returns** `Socket`

`message`이벤트를 전송합니다.

### socket.emit(eventName[,...args][,ack])
*(`EventEmitter.emit`) 오버라이딩 메소드*
- `eventName` (*String*)
- `args`
- `ack`
- *Returns* `true`

문자열로 식별된 소켓에 이벤트를 발송합니다. 다른 어떤 파라미터든 함께 포함될 수 있습니다. `버퍼`를 포함해서 모든 직렬화가능한 데이터 구조는 지원됩니다. 

```javascript
socket.emit('hello', 'world');
socket.emit('with-binary', 1, '2', {3: '4', 5: Buffer.from([6])});
```

`ack` 인자는 선택사항이고 클라이언트의 응답에 불려집니다.
```javascript
io.on('connection', (sockt) => {
  socket.emit('an event', {some: 'data'});
  socket.emit('ferret', 'tobi', (data) => {
    console.log(data); // 'woot'
  });
});

// client-side
client.on('ferret', (name, fn) => {
  fn('woot');
});
```

### socket.on(eventName, callback)
(*`EventEmitter`에서 상속되었음*)
- `eventName` (*String*)
- `callback` (*Function*)
- **Returns** `Socket`

주어진 이벤트의 새로운 핸들러를 등록합니다.
```javascript
socket.on('news', (data) => {
  console.log(data);
});
// 여러 인자일 때
socket.on('news', (arg1, arg2, arg3) => {
  // ...
});
// 또는 승인(acknowledgement)을 보낼 때
socket.on('news', (data, callback) => {
  callback(0);
});
```

### socket.once(eventName, listener)

### socket.removeListener(eventName, listener)

### socket.removeAllListener([eventName])

### socket.eventNames()
`EventEmitter`로 부터 상속받았습니다. Node.js의 [이벤트](https://nodejs.org/docs/latest/api/events.html) 모듈 문서를 참고하세요.

### socket.onAny(callback)
- `callback` (*Function*)

모든 것을 받는(catch-all) 리스너를 등록합니다.
```javascript
socket.onAny((event, ...args) => {
  console.log(`got ${event}`);
});
```

### socket.prependAny(callback)
- `callback` (*Function*)

모든걸 듣는 리스너를 새로 등록합니다. 리스너는 리스너 배열의 가장 첫 번째에서 추가됩니다.
```javascript
socket.prependAny((event, ...args) => {
  console.log(`got ${event}`);
});
```

### socket.offAny([listener])
- `listener` (*Function*)

전에 미리 등록되었던 리스너를 제거합니다. 만약 인자로 리스너가 없으면, 모든 리스너를 제거합니다.
```javascript
const myListener = () => { /* ... */ };
socket.onAny(myListener);

// 나중에
socket.offAny(myListener);
socket.offAny();
```

### socket.listenersAny()
- **Returns** `Function[]`

등록된 모든 리스너의 리스트를 반환합니다.
```javascript
const listeners = socket.listenersAny();
```

### socket.join(room)
- `room` *(string) | (string[])*
- **Returns** `void` | `Promise`

주어진 `room`에 소켓이나 room의 리스트를 추가합니다.
```javascript
io.on('connection', (socket) => {
  socket.join('room 237'); 
  console.log(socket.rooms); // Set { <socket.id>, 'room 237'}
  socket.join(['room 237', 'room 238']);
  io.to('room 237').emit('a new user has joined the room');
})
```

room에 들어가는 매카닉은 `어댑터`(`Server#adapter`)에 의해 처리됩니다. 기본은 `socket.io-adapter`입니다.

편의를 위해서, 각각 소켓은 자동으로 id로 식별된 room에 들어가집니다. (`Socket#id`) 이는 다른 소켓들에 메세지를 브로드캐스팅하는데 쉬워집니다.
```javascript
io.on('connection', (socket) => {
  socket.on('say to someone', (id, msg) => {
    // id가 주어진 소켓에 프라이빗 메세지를 보냅니다.
    socket.to(id).emit('my message', msg);
  });
});
```

### socket.leave(room)
- `room` *(String)*
- **Returns** `void`|`Promise`

주어진 room의 소켓을 삭제합니다.
```javascript
io.on('connection', (socket) => {
  socket.leave('room 237');
  io.to('room 237').emit(`user ${socket.id} has left the room`);
});
```

남겨진 room은 자동으로 연결이 끊어져요

### socket.to(room)
- `room` *(string) | (string[])*
- **Returns** `Socket` for chainig

후에 발생하는 이벤트 발생에 대해 수식어를 설정합니다. 이벤트는 클라이언트가 주어진 room에 들어왔을 때만 발생하고 *브로드캐스팅*됩니다. (이벤트를 발생시키는 소켓은 제외입니다.)

여러 room에 보내기 위해서는, `to`를 여러 번 사용하세요
```javascript
io.on('connection', (socket) => {
  // 하나의 room에
  socket.to('others').emit('an event', { some: 'data' });

  // 여러 room에
  socket.to('room1').to('room2').emit('hello');

  // 여러 room을 하나의 배열로
  socket.ot(['room1', 'room2']).emit('hello');

  // 다른 소켓에 프라이빗 메세지
  socket.to(/* 다른 소켓 아이디 */).emit('hey');

  // 경고!! `socket.to(socket.id).emti()`은 작동하지 않습니다. 같은 room에 다른 모든 사람에게 전송해요.
  // 참고 : socket.id = 내 소켓 아이디
  // 꼭 `socket.emit()`을 원래대로 쓰세요
})
```

**기억하세요** : 확인(acknowledgement)은 브로드카스팅할 때 지원되지 않습니다.

### socket.in(room)
[socket.to(room)](#socket.to(room))과 동일합니다.

### socket.except(rooms)
- `rooms` *(string) | (string[])*
- **Returns** `BroadcastOperator`

후에 발생되는 이벤트에 대해 수식어를 설정합니다. 이벤트는 오직 주어진 room에 있지 **않은** 클라이언트에 대해서만 *브로드캐스팅*됩니다. (이벤트를 발생시키는 소켓은 제외입니다.)

```javascript
// 'room1'에 있지 않은 클라이언트와 전송하는 클라이언트를 제외하고 모든 클라이언트에게
socket.broadcast.except('room1').emit(/* ... */);

// 위랑 같은 코드
socket.except('room1').emit(/* ... */);

// room4에 있고 room5에 있지 않은 모든 클라이언트에게 (보내는 소켓 제외)
socket.to('room4').except('room5').emit(/* ... */);
```

### socket.compress(value)
- `value` *(Boolean)* 따라오는 패킷 압축할지
- **Returns** 연결되는 `Socket`

후에 발생되는 이벤트에 대해 수식어를 설정합니다. 이벤트 데이터는 값이 true일 때만 압출될 수 있습니다. 메소드가 부르지 않으면 기본값은 `true`입니다.

```javascript
io.on('connection', (socket) => {
  socket.compress(false).emit('uncompressed', 'that\'s rough');
});
```

### socket.disconnect(close)
- `close` *(Boolean)* 연결을 닫을지 여부
- **Returns** `Socket`

이 소켓의 연결을 끊습니다. 만약 인자(close)의 값이 `true`이면, 연결을 끊습니다. 인자 값이 `false`이면 네임스페이스 연결을 끊습니다.

```javascript
io.on('connect', (socket) => {
  setTimeout() => socket.disconnect((true), 5000);
});
```

### Flag: 'broadcast'

후에 발생되는 이벤트에 대해 수식어를 설정합니다. 이벤트는 발신자 소켓을 제외한 모든 소켓에게 *브로드캐스팅*만을 합니다.
```javascript
io.on('connection', (socket) => {
  socket.broadcast.emit('an event', { some: 'data' });
});
```

### Flag: 'volatile'

후에 발생되는 이벤트에 대해 수식어를 설정합니다. 클라이언트가 메세지를 받을 준비가 되어있지 않으면 이벤트 데이터는 유실될 수 있습니다. (네트워크 지연 또는 다른 이슈 때문일 수도 있고, 연결되는데 긴 폴링 때문일 수도 있고, 요청-응답 사이클에 중간에 있어서 일 수도 있습니다.)
```javascript
io.on('connection', (socket) => {
  socket.volatile.emit('an event', { some: 'data' });
});
```

### Event: 'disconnect'

- `reason` *(String)* : 연결이 끊어진 이유 (클라이언트측일 수도 있고 서버측일수도 있음)

```javascript
io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    // ...
  });
});
```

가능한 이유들 목록 :
|Reason|Description|
|------|-----------|
|`server namespace disconnect`| 소켓의 연결이 socket.disconnet()에 의해 강제로 끊어졌습니다.|
|`client namespace disconnect`| 클라이언트가 socket.disconnect()를 이용해 수동으로 연결을 끊었습니다.|
|`server shutting down`| 서버가 잘 닫혔습니다.|
|`ping timeout`| 클라이언트가 `pingTimeout` 지연 시간 내에 PONG 패킷을 보내지 않았습니다.|
|`transport close`| 연결이 닫혔습니다 (예: 유저가 연결을 잃음, 네트워크가 와이파이에서 4G로 변경됨)|
|`transport error`| 연결에 오류가 발생했습니다.|

## Client

`client` 클래스는 들어오는 (engine.io) 전송 연결을 나타냅니다. `client`는 서로 다른 네임스페이스에 존재하는 많은 복잡한 `소켓`들과 연결될 수 있습니다.

### Client.conn
- *(engine.Socket)*
`engine.io` 소켓 연결을 참조합니다.

### client.request
- *(Request)*

engine.io 연결에서 발생한 `요청` 참조를 반환하는 프록시를 얻습니다. `Cookie`나 `User-Agnet`와 같은 요청 헤더에 접근하는데 유용합니다.

## Engine

WebSocket/HTTP 긴-폴링 연결을 다루는 Engine.IO 서버입니다. 더 많은 정보는 [여기](#https://socket.io/docs/v4/how-it-works/)를 확인하세요.

### engine.clientsCount
- *(Number)*
현재 연결된 클라이언트들의 개수입니다.
```javascript
const count = io.engine.clientCount;
// 메인 네임스페이스 안의 소켓 인스턴스들의 개수와 비슷할 수도 있고 비슷하지 않을 수도 있어요
// 사용에 따라 달라집니다.
const count2 = io.of('/').sockets.size;
```

### engine.generateId
- *(Function)*

새로운 세션 ID를 생성하는데 이용하는 함수입니다. 기본값은 base64id입니다.
```javascript
const uuid = require('uuid');
io.engine.generatedId = () => {
  return uuid.v4(); // 모든 Socket.IO 서버를 통틀어 유니크해야 합니다.
}
```

### engine.handleUpgrade(request, socket, head)
- `request` *(http.IncomingMessage)* : 들어오는 요청
- `socket` *(stream.Duplex)* : 서버와 클라이언트 간에 네트워크 소켓
- `head` *(Buffer)* : 업그레이드 된 소켓의 첫 번째 패킷 (아마 비어있을 거에요)

이 메소드를 이용해서 HTTP를 업그레이드 할 수 있습니다. :
이 예제는 Socket.IO, 플레인 WebSocket 서버에서 모두 사용될 수 있습니다.
```javascript
const { createServer } = require('http');
const ws = require('ws');
const { Server } = require('socket.io');

const httpServer = createServer();
const wss = new ws.Server({ noServer: true });
const io = new Server(httpServer);

httpServer.removeAllListener('upgrade');
httpServer.on('upgrade', (req, socket, head) => {
  if (req.url === '/') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else if(req.url.startsWith('/socket.io/')) {
    io.engine.handleUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

httpServer.listen(3000);
```

### Event: 'initial_headers'
- `headers` *(Object)* : 헤더의 해쉬값, 헤더 이름으로 인덱싱됨
- `reqeust` *(http.IncomingMessage)* : 들어오는 요청

이 이벤트는 세션(handshake)의 가장 첫 번째 HTTP 요청의 응답 헤더가 작성되기 전에 발생됩니다. 커스터마이징할 수 잇습니다.

```javascript
io.engine.on('initial_headers', (headers, request) => {
  headers['test'] = '123';
  headers['set-cookie'] = 'mycookie=456';
});
```

### Event: 'headers'
- `headers` *(Object)* : 헤더의 해쉬값, 헤더 이름으로 인덱싱됨
- `reqeust` *(http.IncomingMessage)* : 들어오는 요청

이 이벤트는 (WebSocket 업그레이드 포함한) 세션의 각각의 HTTP 요청의 응답 헤더가 작성되기 전에 발생됩니다.  커스터마이징할 수 잇습니다.

```javascript
io.engine.on('headers', (headers, request) => {
  headers['test'] = '789';
});
```

### Event: 'connection_error'
- `error` *(Error)*
```javascript
io.engine.on('connection_error', (err) => {
  console.log(err.req); // 요청 객체
  console.log(err.code); // 에러 코드 (Code)
  console.log(err.message); // 에러 메세지 (Message)
  console.log(err.context); // 추가 에러 내용
})
```

이 이벤트는 비정상적으로 연결이 닫혔을 때 발생됩니다. 여기는 발생할 수 있는 에러 코드들입니다.:
|Code|Message|
|----|-------|
|0|"Transport unknown"|
|1|"Session ID unknown"|
|2|"Bad handshake method"|
|3|"Bad request"|
|4|"Forbidden"|
|5|"Unsupported protocol version"|

# The Socket Instance

소켓 인스턴스는 적은 속성만 사용됩니다.

## Socket#id

각각의 새로운 연결은 랜덤으로 20글자의 식별자가 할당됩니다.

이 식별자는 클라이언트 측과도 같은 값으로 싱크됩니다.

```javascript
// server-side
io.on('connection', (socket) => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

// client-side
socket.on('connect', () => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});
```

생성되면, 소켓은 각자의 id로 식별된 room에 들어갑니다. 즉, 프라이빗 메세지는 보내는 데 사용할 수 있습니다.
```javascript
io.on('connection', socket => {
  socket.on('private message', (anoterSocketId, msg) => {
    socket.to(anotherSocketId).emit('private message', socket.id, msg);
  });
});
```

기억하세요 : Socket.IO 코드의 여러 곳에서 쓰이므로 이 식별자는 새로 덮어쓸 수 없습니다! 

## Socket#handshake

이 객체는 Socket.IO 세션의 가장 처음에 발생하는 핸드셰이크의 세부사항들을 포함하고 있습니다.

```javascript
{
  headers: /* 핸드셰이크 일부로 보내진 헤더 */,
  query: /* 첫 번째 요청의 쿼리 파라미터 */,
  auth: /* 인증 페이로드 */,
  time: /* 만들어진 일시 (문자열 형태) */,
  issued: /* 만들어진 일시 (유닉스 타임스탬프 형태) */,
  url: /* 요청 URL 문자열 */,
  address: /* 클라이언트 ip주소 */,
  xdomain: /* 요청이 CORS인지 */,
  secure: /* 요청이 보안이 되어있는지 */,
}
```

예:

```javascript
{
  "headers": {
    "user-agent": "xxxx",
    "accept": "*/*",
    "host": "example.com",
    "connection": "close"
  },
  "query": {
    "EIO": "4",
    "transport": "polling",
    "t": "NNjNltH"
  },
  "auth": {
    "token": "123"
  },
  "time": "Sun Nov 22 2020 01:33:46 GMT+0100 (Central European Standard Time)",
  "issued": 1606005226969,
  "url": "/socket.io/?EIO=4&transport=polling&t=NNjNltH",
  "address": "::ffff:1.2.3.4",
  "xdomain": false,
  "secure": true
}
```

## Socket#rooms

소켓이 현재 들어가 있는 room을 참조합니다.

```javascript
io.on("connection", (socket) => {
  console.log(socket.rooms); // Set { <socket.id> }
  socket.join("room1");
  console.log(socket.rooms); // Set { <socket.id>, "room1" }
});
```

## Socket#data

유틸리티 메소드인 `fetchSockets()`와 함께 쓸 수 있는 접속사로 쓰이는 임의의 객체

```javascript
// 서버 A
io.on("connection", (socket) => {
  socket.data.username = "alice";
});

// 서버 B
const sockets = await io.fetchSockets();
console.log(sockets[0].data.username); // "alice"
```

## Additional attributes

존재하는 속성 중 어떤 것도 덮어쓰지 않는 한, 어떤 속성이든 소켓 인스턴스에 붙일 수 있습니다. 

다음과 같이 쓸 수 있습니다. :

```javascript
// 미들웨어에서
io.use(async (socket, next) => {
  try {
    const user = await fetchUser(socket);
    socket.user = user;
  } catch (e) {
    next(new Error("unknown user"));
  }
});

io.on("connection", (socket) => {
  console.log(socket.user);

  // 리스너에서
  socket.on("set username", (username) => {
    socket.username = username;
  });
});
```

## Socket middlewares

들어오는 각각의 패킷이 불려지는 걸 제외하고 미들웨어들은 보통의 미들웨어와 매우 비슷합니다. 

```javascript
socket.use(([event, ...args], next) => {
  // 패킷으로 어떤 일을 합니다 (logging, authorization, rate limiting...)
  // 마지막에 next()를 호출하는 걸 잊지 마세요!
  next();
});
```

`next` 메소드는 에러 객체와 함께 불릴 수 있습니다. 그런 경우에, 등록된 이벤트 핸들러에 다다르지 못하고 대신에 에러 이벤트가 발생됩니다.

```javascript
io.on("connection", (socket) => {
  socket.use(([event, ...args], next) => {
    if (isUnauthorized(event)) {
      return next(new Error("unauthorized event"));
    }
    next();
  });

  socket.on("error", (err) => {
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });
});
```

기억해두세요: 이 기능은 오직 서버 측에서만 있습니다. 클라이언트 측은, catch-all listeners를 사용하세요.

## Events

서버 측에서, 소켓 인스턴스는 두 가지 특별한 이벤트가 발생합니다:
- `disconnect`
- `disconnecting`

### `disconnect`

이 이벤트는 소켓 인스턴스가 끊어질ㄷ 때 발생됩니다.

```javascript
io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    // ...
  });
});
```

가능한 이유들의 목록입니다:
|Reason|Description|
|------|-----------|
|`server namespace disconnect`| 소켓의 연결이 socket.disconnet()에 의해 강제로 끊어졌습니다.|
|`client namespace disconnect`| 클라이언트가 socket.disconnect()를 이용해 수동으로 연결을 끊었습니다.|
|`server shutting down`| 서버가 잘 닫혔습니다.|
|`ping timeout`| 클라이언트가 `pingTimeout` 지연 시간 내에 PONG 패킷을 보내지 않았습니다.|
|`transport close`| 연결이 닫혔습니다 (예: 유저가 연결을 잃음, 네트워크가 와이파이에서 4G로 변경됨)|
|`transport error`| 연결에 오류가 발생했습니다.|

### `disconnecting`

이 이벤트는 `disconnect`와 비슷하지만 Socket#rooms이 아직 비어있지 않을 때 조금 빨리 발생합니다. 

```javascript
io.on("connection", (socket) => {
  socket.on("disconnecting", (reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.id);
      }
    }
  });
});
```

기억해두세요 : `connect`, `connect_error`, `newListener`, `removeListener` 이 이벤트들은 어플리케이션에서 사용되지 않는 특별한 이벤트들입니다.

```javascript
// 하지 마세요! 에러 발생합니다.
socket.emit("disconnect");
```

# Middlewares

미들웨어 함수는 모든 들어오는 연결에 발생하는 함수입니다.

미들웨어 함수는 이 경우에 유용해요:
- 로깅
- 인증(authentication)/허가(authorization)
- 비율 제한(rate limiting)

기억해두세요 : 이 함수는 한 연결에 한 번씩 발생합니다. (여러 HTTP 요청에 연결이 포함되더라도)

## Registering a middleware

미들웨어 함수는 소켓 인스턴스에 접근하고 다음 등록된 미들웨어 함수로 접근합니다.

```javascript
io.use((socket, next) => {
  if (isValid(socket.request)) {
    next();
  } else {
    next(new Error("invalid"));
  }
});
```

여러 개의 미들웨어 함수도 등록할 수 있습니다. 여러 함수들은 순차적으로 실행됩니다.

```javascript
io.use((socket, next) => {
  next();
});

io.use((socket, next) => {
  next(new Error("thou shall not pass"));
});

io.use((socket, next) => {
  // 전 미들웨어가 에러를 반환해서 여기는 실행되지 않아요
  next();
})
```

어떤 경우든 `next()`를 꼭 부르도록 하세요. 부르지 않으면, 연결은 다음 지정된 시간초과후 닫힐 때까지 연결이 남겨집니다.

**꼭! 기억해두세요**: 미들웨어가 실행될 때 소켓 인스턴스는 실제로 연결되지 않습니다. 이 말은 즉, 만약 연결에 실패하면, `disconnect` 이벤트가 발생되지 않습니다.

예를 들어, 만약 클라이언트가 직접 연결을 닫으면:
```javascript
// 서버 측
io.use((socket, next) => {
  setTimeout(() => {
    // next는 클라이언트가 연결이 끊어진 후에 불려집니다.
    next();
  }, 1000);

  socket.on("disconnect", () => {
    // 불리지 않음
  });
});

io.on("connection", (socket) => {
  // 불리지 않음
});

// 클라이언트 측
const socket = io();
setTimeout(() => {
  socket.disconnect();
}, 500);
```

## Sending credentials

클라이언트는 `auth` 옵션과 함께 자격 증명을 보낼 수 있습니다.

```javascript
// 플레인 객체
const socket = io({
  auth: {
    token: "abc"
  }
});

// 또는 다른 함수로
const socket = io({
  auth: (cb) => {
    cb({
      token: "abc"
    });
  }
});
```
