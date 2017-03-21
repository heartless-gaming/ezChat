// nodeJS path resolution module https://nodejs.org/api/path.html
let path = require('path')

// Back office / node Server Configuration variables
let ezchatConfig = {
  serverPort: 3000,
  path: {
    root: path.join(__dirname, '..'),
    frontFolderName: 'dist',
    backFolderName: 'server'
  }
}

// Setup basic express server
let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)

server.listen(ezchatConfig.serverPort, function () {
  console.log('Server listening at port %d', ezchatConfig.serverPort)
})

// Routing
let frontRoute = path.join(ezchatConfig.path.root, ezchatConfig.path.frontFolderName)
app.use(express.static(frontRoute))

// Chatroom
let numUsers = 0

io.on('connect', function (socket) {
  let addedUser = false

  // when a client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell all clients to execute 'new message'
    console.log("new message from :" + data.author )
    console.log("Text :" + data.text )
    socket.broadcast.emit('new message', {
      author: data.author,
      text: data.text
    })
  })

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (author) {
    if (addedUser) return

    // we store the author in the socket session for this client
    socket.author = author
    ++numUsers
    addedUser = true
    socket.emit('login', {
      numUsers: numUsers
    })
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      author: socket.author,
      numUsers: numUsers
    })
  })

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      author: socket.author
    })
  })

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      author: socket.author
    })
  })

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        author: socket.author,
        numUsers: numUsers
      })
    }
  })
})
