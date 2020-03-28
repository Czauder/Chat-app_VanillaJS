const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {
    userJoin,
    getCurrentUser
} = require('./utils/users')

const app = express();

const server = http.createServer(app);
const io = socketio(server)

// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatCord Bot"

// Run when client connect
io.on('connection', socket => {
    socket.on('joinRoom', ({
        username,
        room
    }) => {


        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to chat'))

        // Broadcast when a user connects
        socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));
    })

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg))
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));