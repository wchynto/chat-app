const submitButton = document.querySelector('.btn-send')
const chatContainer = document.querySelector('.chat-container')
const inputMessage = document.querySelector('.input-message') 

const socket = io()

function senderMessage(msg) {
    const senderBox = document.createElement('div')
    senderBox.className = 'sender-box'
    const senderName = document.createElement('div')
    senderName.className = 'name'
    senderName.innerHTML = '-> ' + msg.username
    const senderMessage = document.createElement('div')
    senderMessage.className = 'message'
    senderMessage.innerHTML = msg.message
    
    senderBox.appendChild(senderName)
    senderBox.appendChild(senderMessage)

    chatContainer.appendChild(senderBox)
}

function receiverMessage(msg) {
    const receiverBox = document.createElement('div')
    receiverBox.className = 'receiver-box'
    const receiverName = document.createElement('div')
    receiverName.className = 'name'
    receiverName.innerHTML = $.cookie('username') + ' <-'
    const receiverMessage = document.createElement('div')
    receiverMessage.className = 'message'
    receiverMessage.innerHTML = msg

    receiverBox.appendChild(receiverName)
    receiverBox.appendChild(receiverMessage)

    chatContainer.appendChild(receiverBox)
}

submitButton.addEventListener('click', () => {
    if (inputMessage.value.trim() != '' ){
        receiverMessage(inputMessage.value)
        socket.emit('message', {
            username: $.cookie("username"),
            message: inputMessage.value
        })
        inputMessage.value = ''
        window.scrollTo(0, document.body.scrollHeight)
    } 
})

inputMessage.addEventListener('keypress', (event) => {
    if (event.key === 'Enter'){
        if (inputMessage.value.trim() != '' ){
            receiverMessage(inputMessage.value)
            socket.emit('message', {
                username: $.cookie("username"),
                message: inputMessage.value
            })
            inputMessage.value = ''
            window.scrollTo(0, document.body.scrollHeight)
        } 
    }
})

socket.on('message', (msg) => {
    senderMessage(msg)
})