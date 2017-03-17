# eZchat Event
What does the server returns upon receiving an event from the client.

For all the exemple below `socket = io()`.

Event list :
- [New Message](#new-message)
- [Add User](#add-user)
- [User Joined](#user-joined)
- [User Left](#user-left)
- [Typing](#typing)
- [Stop Typing](#stop-typing)
- [Diconnect](#disconnect)


## New Message
When a clients emit a *new message* event the server broadcast a *new message* event that returns an object containing the username and message.

**Client / Front**
```js
// Whenever the server emits 'new message', update the chat body
socket.on('new message', function (data) {
  addChatMessage(data);
});
```
```js
// Tells the server that a user is sending a message
socket.emit('new message', message);
```

**Server / Back**
```js
// when a client emits 'new message', this listens and executes
socket.on('new message', function (data) {
  // we tell all clients to execute 'new message'
  socket.broadcast.emit('new message', {
    username: socket.username,
    message: data
  })
})
```

## Add user
A client emit *add user* once a user as set is username.

**Client / Front**
```js
// Tell the server your username
socket.emit('add user', username);
```

## User Joined

The server broadcast a *user joined* event upon receiving an [add user](#add-user) event. Returns an object containing the username of the user that has just join in and the number of people in the chat has a second argument.

**Client / Front**
```js
// Listen to client joining the chat
socket.on('user joined', function (data) {
  // data = {username: Skullmasher, numUsers: 6}
});
```

**Server / Back**
```js
// Tell all clients that a person has connected
socket.broadcast.emit('user joined', {
  username: socket.username,
  numUsers: numUsers
})
```

## User Left
The client side listen to this event to know when a user as left the chat. Also returns the number of people in the chat has a second argument.

**Client / Front**
```js
// Listen to a client that left the chat
socket.on('user left', function (data) {
  // data = {username: Skullmasher, numUsers: 6}
});
```

## Typing
There's no need to pass argument to the *typing* event from the client side because the server will match who is typing with *socket.username*. The server returns the username curently typing (might need refactoring).

**Client / Front**
```js
socket.emit('typing');
```
**Server / Back**
```js
// when the client emits 'typing', we broadcast it to others
socket.on('typing', function () {
  socket.broadcast.emit('typing', {
    username: socket.username
  })
})
```

## Stop Typing
There's no need to pass argument to the *stop typing* event from the client side because the server will match who is typing with *socket.username*. The server returns the username that is no longer typing.

**Client / Front**
```js
socket.emit('stop typing');
```
**Server / Back**
```js
// when the client emits 'stop typing', we broadcast it to others
socket.on('stop typing', function () {
  socket.broadcast.emit('stop typing', {
    username: socket.username
  })
})
```

## Diconnect
Reserved event that the server is listenning to. Returns a *user left* event containing the username of the user that just left and the number of user still chatting.

**Server / Back**
socket.on('disconnect', function () {
  // Tells all clients that someone has disconnect
  socket.broadcast.emit('user left', {
    username: socket.username,
    numUsers: numUsers
  })
})

**Note:** The following events are reserved and should not be used as event names by your application:
- `error`
- `connect`
- `disconnect`
- `disconnecting`
- `newListener`
- `removeListener`
- `ping`
- `pong`
