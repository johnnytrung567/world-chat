const msgForm = document.getElementById('msg-form')

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

const socket = io()

// Join room
socket.emit('joinRoom', { username, room })

// Get room info and users
socket.on('roomInfo', ({ room, users }) => {
    renderRoomName(room)
    renderUsers(users)
})

// Message from server
socket.on('message', message => {
    renderMessage(message)
})

// Own message from server
socket.on('ownMessage', message => {
    isOwned = true
    renderMessage(message, isOwned)
})

// Handle send message
msgForm.addEventListener('submit', e => {
    e.preventDefault()

    const msgText = document.getElementById('msg-text')
    socket.emit('sendMessage', msgText.value)

    msgText.value = ''
    msgText.focus()
})

// Render message to chatbox
function renderMessage(message, isOwned) {
    const chatbox = document.getElementById('chatbox')

    const div = document.createElement('div')
    if (isOwned)
        // Sender
        div.classList.add(
            'own-message',
            'bg-success',
            'text-light',
            'w-75',
            'm-3',
            'rounded',
            'align-self-end'
        )
    // Receiver
    else div.classList.add('message', 'bg-light', 'w-75', 'm-3', 'rounded')

    div.innerHTML = `<p class="fw-bold m-2 mb-0">${message.name} <span class="fw-normal small">${message.time}</span></p>
    <p class="m-2 mt-0">${message.text}</p>`

    chatbox.appendChild(div)
    chatbox.scrollTo(0, chatbox.scrollHeight)
}

// Render room name
function renderRoomName(room) {
    const roomName = document.getElementById('room-name')
    roomName.innerText = `Phòng chat ${room}`
}

// Render list users in room
function renderUsers(users) {
    const listUsers = document.getElementById('list-users')

    listUsers.innerHTML = `${users
        .map(user => `<li>${user.username}</li>`)
        .join('')}`
}
