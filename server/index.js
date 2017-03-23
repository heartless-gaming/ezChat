// Require some deps
let path = require('path') // nodeJS path resolution module https://nodejs.org/api/path.html
let _ = require('lodash') // helpers around javascript API

// Back office / node Server Configuration variables
let ezchatConfig = {
  serverPort: 3000,
  massageHistory: 100, // Number of old message to show on user connection
  path: {
    root: path.join(__dirname, '..'),
    frontFolderName: 'dist',
    backFolderName: 'server'
  }
}

/*
 * Routing & Express Server
 */
let express = require('express')
let app = express()
let server = require('http').createServer(app)
let io = require('socket.io')(server)

server.listen(ezchatConfig.serverPort, function () {
  console.log('Server listening at port %d', ezchatConfig.serverPort)
})

let frontRoute = path.join(ezchatConfig.path.root, ezchatConfig.path.frontFolderName)
app.use(express.static(frontRoute))

// userlist return the userlist & the number of users
app.get('/users', function (req, res) {
  res.send({
    'users': users,
    'userCount': userCount
  })
})

// massages return the last 100 message
app.get('/messages', function (req, res) {
  res.send(messages)
})

/*
 * Chatroom handling
 */
let userCount = 0
let users = []
let messages = [
  {author: 'yolo', text: 'swagg'},
  {author: 'ADN', text: 'Skull, please stop believing in another Half-Life game.'},
  {author: 'ADN', text: 'It\'s getting ridiculous at this point...'},
  {author: 'Skullmasher', text: 'But I want to believe tho...'},
  {author: 'G-Man', text: 'Prepare for unforeseen consequences'},
  {author: 'Skullmasher', text: 'Holy Shit !'},
  {author: 'Gordon Freeman', text: '*Gordon is mute*'},
  {author: 'Smith', text: 'Why, Mr. Anderson? Why, why? Why do you do it? Why, why get up? Why keep fighting? Do you believe you\'re fighting... for something? For more than your survival? Can you tell me what it is? Do you even know? Is it freedom? Or truth? Perhaps peace? Could it be for love? Illusions, Mr. Anderson. Vagaries of perception. Temporary constructs of a feeble human intellect trying desperately to justify an existence that is without meaning or purpose. And all of them as artificial as the Matrix itself, although... Only a human mind could invent something as insipid as love. You must be able to see it, Mr. Anderson. You must know it by now. You can\'t win. It\'s pointless to keep fighting. Why, Mr. Anderson? Why? Why do you persist?'},
  {author: 'Neo', text: 'Because I choose to.'},
  {author: 'Skullmasher', text: 'https://youtu.be/_f6MRkTLT9o'},
  {author: 'ADN', text: 'https://i.imgur.com/JavMJGH.mp4'}
] // Test Mesage sample

// Pull the last message if the Massage Aray reach the maximum number of message configured
let updateMessages = function (author, text) {
  let msglength = messages.length
  if (msglength >= ezchatConfig.massageHistory) {
    messages.shift()
    messages.push({author: author, text: text})
    console.log('Massage limit as been reached. Pulling first message.')
  } else {
    messages.push({author: author, text: text})
    console.log('new message from :' + author)
    console.log('Text :' + text)
  }
}

let addNewUser = function (author) {
  // If the user does not exist add him to the users array
  if (users.indexOf(author) === -1) {
    users.push(author)
    ++userCount
    console.log(author + ' Added to userlist')
  }
}

io.on('connect', function (socket) {
  let addedUser = false

  // when a client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    let author = data.author
    let text = data.text

    addNewUser(author)
    updateMessages(author, text)
    addedUser = true

    // we tell all clients to execute 'new message'
    socket.broadcast.emit('new message', {
      author: author,
      text: text
    })
  })

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (author) {
    if (addedUser) return

    // we store the author in the socket session for this client
    socket.author = author
    socket.emit('login', {
      userCount: userCount
    })
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      author: socket.author,
      userCount: userCount
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
      _.pull(users, socket.author) // Does not work socket.author is not defined
      --userCount
      console.log(userCount + ' user connected')
      console.log(users)

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        author: socket.author,
        userCount: userCount
      })
    }
  })
})
