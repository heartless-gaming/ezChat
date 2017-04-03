/*
 * Require some deps
 */
let path = require('path') // nodeJS path resolution module https://nodejs.org/api/path.html
let _ = require('lodash') // helpers around javascript API

/*
 * eZchat Server Configuration variables
 */
let ezchatConfig = {
  serverPort: 3000,
  defaultUsername: 'Anonymous', // Users will have that username by default
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
 * Variables & Functions for chatroom handling
 */
let userCount = 0
let users = []
let usersSocketId = [] // Bind users to the correct socketid
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
  {author: 'ADN', text: 'https://i.redd.it/evvrqz8448oy.jpg'}
]
// Add default user
let addDefaultUser = function (socketId) {
  userCount++

  let username = ezchatConfig.defaultUsername + userCount
  // while we find user with the same name
  while (users.indexOf(username) !== -1) {
    username = ezchatConfig.defaultUsername + (userCount + 1)
  }

  users.push(username)
  usersSocketId.push(socketId)

  return username
}

let onChangeUsername = function (newUsername, socketId) {
  // Find index of socketId and modify the user with that index
  let socketIdIndex = usersSocketId.indexOf(socketId)

  users[socketIdIndex] = newUsername
}
// Pull last message if the Message Array reach the maximum number of message
let updateMessageHistory = function (author, text, img, youtube) {
  if (messages.length >= ezchatConfig.massageHistory) {
    messages.shift() // Delete the oldest message
  }

  messages.push({author: author, text: text, img: img, youtube: youtube})
}

/*
 * Socket event manadgement
 */
io.on('connect', function (socket) {
  socket.on('add user', function () {
    let username = addDefaultUser(socket.id)
    // echo globally that a person has connected as a defaultuser
    socket.broadcast.emit('update users', users)
    socket.emit('update users', users)
  })

  socket.on('change username', function (newUsername) {
    onChangeUsername(newUsername, socket.id) // update the user
    socket.broadcast.emit('update users', users) // Asking client to refresh onlineUsers
    socket.emit('update users', users) // Asking client to refresh onlineUsers
  })

  // when a client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    let author = data.author
    let text = data.text

    // Image matching
    let imageLink = null
    let imageRegex = new RegExp('(https?://.*.(?:png|jpg|gif))')
    let img = text.match(imageRegex)

    if (img) imageLink = img[1]

    // Youtube matching
    let youtubeLink = null
    let youtubeRegex = new RegExp(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i)
    let youtubeMatch = text.match(youtubeRegex)

    if (youtubeMatch) youtubeLink = '//www.youtube.com/embed/' + youtubeMatch[1] + '?rel=0'

    // update Message history
    updateMessageHistory(author, text, imageLink, youtubeLink)
    // we tell all other clients to execute 'new message'
    socket.broadcast.emit('new message', {
      author: author,
      text: text,
      img: imageLink,
      youtube: youtubeLink
    })
    socket.emit('new message', {
      author: author,
      text: text,
      img: imageLink,
      youtube: youtubeLink
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
  socket.on('disconnect', function (reason) {
    // Remove user by finding is socket.id
    let socketIdIndex = usersSocketId.indexOf(socket.id)

    if (socketIdIndex >= 0) {
      _.pullAt(usersSocketId, socketIdIndex)
      _.pullAt(users, socketIdIndex)
      userCount--

      // echo globally that this client has left
      socket.broadcast.emit('update users', users)
      socket.emit('update users', users)
    }
  })
})
