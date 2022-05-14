const users = []

// User join chat room
function userJoin(id, username, room) {
    const newUser = { id, username, room }

    users.push(newUser)
    return newUser
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

// User leaves chat room
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)

    if (index > -1) return users.splice(index, 1)[0]
}

// Get users's room
function getRoom(room) {
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoom }
