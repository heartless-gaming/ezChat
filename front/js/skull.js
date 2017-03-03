$(function () {
  var socket = io()
  console.log(socket)
    // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    console.log('logged in')
  })

    // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    console.log('New message')
  })

    // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    console.log('User joined')
  })

    // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    console.log('User left')
  })

    // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    console.log('User typing')
  })

    // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    console.log('stop typing')
  })

  socket.on('disconnect', function () {
    console.log('You just disconnected')
  })

  socket.on('reconnect', function () {
    console.log('You have been recconnected')
  })

  socket.on('reconnect_error', function () {
    console.log('Recoonnection has failed')
  })
})
