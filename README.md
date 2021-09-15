# socket-chat-serverside
node.js socket serverside toy project with noonnoo
</br>
</br>

# Node.js Socket.IO
</br>
출처 : https://socket.io/docs

## Socket.IO가 뭔가요?
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
</br>

## Installation
```
npm install socket.io
```

## Initialization

### Standalone

```javascript
const io = require('socket.io')(options);

io.on('connection', (socket) => {
    /* ... */
});
io.listen(3000);
```
</br>
인자에 포트를 바로 넣어주고 싶다면

```javascript
const options = { /* ... */ };
const io = require('socket.io')(3000, options;

io.on('connection', (socket) => {
    /* ... */
});
```


### 기존 HTTP 서버에 붙여서 초기화
- **HTTP** 서버
```javascript
const httpServer = require('http).createServer();
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
    cert: fs.readFilesync('/tmp/cert.pem)
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

### Express에 초기화
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

### Options
```javascript
const options = {
    path: "/test",
    serveClient: false,
    // 아래는 engine.IO 옵션
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
};
```

- `path`
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

- `serveClient`
  - default value : `true`
클라이언트 파일을 보낼지에 대한 옵션입니다. `true`면 다음 위치에서 번들이 제공됩니다.
  - `<url>/socket.io/socket.io.js`
  - `<url>/socket.io/socket.io.min.js`
  - `<url>/socket.io/socket.io.msgpack.min.js`

- `adapter`
  - default value : `socket.io-adapter` (인메모리 어댑터입니다)
Redis 어댑터를 쓴다면 예시는 아래와 같습니다 (`socket.io-redis` 패키지를 사용합니다)
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

- `parser`
  - default value : `socket.io-parser`

- `connectTimeout`
  - default value : `45000`
namespace에 접속이 안되면 접속시도가 끊어지는 ms

#### Low-level engine options
- `pintTimeout`
  - default value : `20000`
서버와 클라이언트의 연결이 죽지 않고 잘 살아있는지 간헐적으로 확인하는 `하트비트 매카니즘`에 이용됩니다. 
</br>
1. 서버에서 핑을 보냈는데 클라이언트가 `pintTimeout` 시간내에 퐁을 보내지 않는다면 서버는 연결이 끊어졌다고 간주합니다.
2. 클라이언트가 `pingInterval + pingTimeout` 시간 내에 핑을 받지 못하면 클라이언트는 연결이 끊어졌다고 간주합니다.

</br>
이 두 경우에 연결이 끊어진(disconnection) 이유(reason)는 `ping timeout`이 됩니다

```javascript
socket.on('disconnect', (reason) => {
    console.log(reason);
    // "ping timeout"
});
```
</br>

**기억해두세요!** : 어플리케이션에서 큰 파일을 전송하면 기본값이 부족할 수 있어요. 큰 파일을 보내는 경우에는 `pingTimeout` 설정을 올려두세요
```javascript
const io = require('socket.io')(httpServer, {
    pingTimeout: 30000
});
```

- `pingInterval`
  - default value : `25000`
`pingTimeout`에서 클라이언트가 서버의 핑을 기다리는데 필요한 추가 시간

- `upgradeTimeout`
  - default value : `10000`
완료되지 않은 전송 업그레이드가 취소되기 전 지연시간 (ms)

- `maxHttpBufferSize`
  - default value : `1e6` (1MB)
소켓이 닫히기 전까지 한 메세지에 몇 바이트까지 가능한건지 정의합니다. 필요에 따라서 값을 조절하세요.
```javascript
const io = require('socket.io')(httpServer, {
    maxHttpBufferSize: 1e8
});
```

- `allowRequest`
  - `default` : -
주어진 핸드셰이크 또는 업그레이드 요청을 첫 번째 매개 변수로 수신받고, 핸드셰이크를 계속할지 결정하는 함수
```javascript
const io = require('socket.io')(httpServer, {
    allowRequest: (req, callback) => {
        const isOriginValid = check(req);
        callback(null, isOriginValid);
    }
});
```

- `transport`
  - default value : `['polling', 'websocket']`
서버 사이드에서 허용되는 low-level 전송입니다.

- `allowUpgrades`
  - default value : `true`
전송 업그레이드를 허용할지 옵션입니다.

- `cookie`
  - default value : `-`
Socket.IO v3부터 쿠키는 기본으로 제공되지 않음
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

### The Server instance
코드에서 주로 `io`로 선언되는 서버 인스턴스는 어플리케이션에서 사용되는 몇 개의 속성이 있습니다.
서버 인스턴스는 메인 네임스페이스의 메소드를 상속합니다. (예 : `namespace.use()`, `namespace.allSockets()`)

#### Server#engine
기존 Engine.IO 서버를 참조합니다.
현재 연결된 많은 개수의 클라이언트를 가지고 오는데 사용할 수 있습니다.
```javascript
const count = io.engine.clientCount;
// count : 사용량에 따라 메인 네임스페이스의 소켓 인스턴스 수와 유사할 수도 있고 유사하지 않을 수도 있어요
const count2 = io.of('/').sockets.size;
```
</br>

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
    |0|알 수 없는 전송("Transport unknown")|
    |1|알 수 없는 세션 ID("Session ID unknown")|
    |2|잘못된 핸드셰이크 메소드("Bad handshake method")|
    |3|잘못된 요청("Bad request")|
    |4|거절("Forbidden")|
    |5|지원되지 않는 프로토콜 버전("Unsupported protocol version")|

#### Utility methods
소켓 인스턴스와 그 room들을 다룰 수 있는 유틸리티 메소드가 Socket.IO v4.0.0에 추가되었습니다.
- `socketsJoin` : 일치하는 소켓 인스턴스가 특정 채팅방에 들어갈 수 있도록 해줘요
- `socketsLeave` : 일치하는 소켓 인스턴스가 특정 채팅방에서 나오도록 해줘요
- `disconnectSockets` : 일치하는 소켓 인스턴스의 연결을 끊어요
- `fetchSockets` : 일치하는 소켓 인스턴스를 반환해줘요
</br>

`serverSideEmit` 메소드가 Socket.IO v4.1.0에 추가되었습니다.
</br>

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

#### `socketsJoin`
