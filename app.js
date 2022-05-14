const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoom,
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const botName = 'Hệ thống'

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Run when client connects
io.on('connection', socket => {
    // User join room
    socket.on('joinRoom', ({ username, room }) => {
        const userInfo = userJoin(socket.id, username, room)
        console.log(userInfo)

        socket.join(userInfo.room)

        // Welcome new user to room
        socket.emit(
            'message',
            formatMessage(
                botName,
                `Chào mừng bạn đến với phòng chat ${userInfo.room}`
            )
        )

        // Broadcast when a user connects
        socket.broadcast
            .to(userInfo.room)
            .emit(
                'message',
                formatMessage(botName, `${userInfo.username} đã tham gia phòng`)
            )

        // Send users and room info
        io.to(userInfo.room).emit('roomInfo', {
            room: userInfo.room,
            users: getRoom(userInfo.room),
        })
    })

    // Listen for send message
    socket.on('sendMessage', message => {
        const userInfo = getCurrentUser(socket.id)

        // Sender
        socket.emit('ownMessage', formatMessage('Bạn', message))

        // Receiver
        socket.broadcast
            .to(userInfo.room)
            .emit('message', formatMessage(userInfo.username, message))
    })

    // Run when client disconnects
    socket.on('disconnect', () => {
        const userInfo = userLeave(socket.id)

        if (userInfo) {
            io.to(userInfo.room).emit(
                'message',
                formatMessage(botName, `${userInfo.username} đã rời khỏi phòng`)
            )
            // Send users and room info
            io.to(userInfo.room).emit('roomInfo', {
                room: userInfo.room,
                users: getRoom(userInfo.room),
            })
        }
    })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
)
