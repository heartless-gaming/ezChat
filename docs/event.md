# eZchat Event
What does the server returns upon receiving an event from the client.

For all the exemple below `socket = io()`.

Event list :
- [New Message](#new-message)

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
When a clients emit a *add user* event the server returns an object with the username and the content of the message. This event can be called on the **connect** and **reconnect** event.

**Note:** The following events are reserved and should not be used as event names by your application:
- `error`
- `connect`
- `disconnect`
- `disconnecting`
- `newListener`
- `removeListener`
- `ping`
- `pong`
