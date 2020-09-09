let connection;
let username;
let currentContact;
let messagesDictionary = {};

//functions

function openChatConnection() {
    connection = new WebSocket(`ws://localhost:8080/`);
    connection.onopen = () => {
        console.log('connected');
    };
    
    connection.onclose = () => {
        console.error('disconnected');
    };
    
    connection.onerror = (error) => {
        console.error('failed to connect', error);
    };
    
    connection.onmessage = (event) => {  
        if (event.data === 'who dis??') {
            connection.send('I B ' + username);
        } else {
            const data = JSON.parse(event.data);
            if (data.sender === username) {
                messagesDictionary[data.receipient].push({sender: data.sender, message: data.message});
            } else {
                messagesDictionary[data.sender].push({sender: data.sender, message: data.message});
                document.getElementById('receiving-audio').play();
            }
            if (data.receipient === currentContact || data.sender === currentContact){
                displayMessage(data);
            }
        }
    };
}
function setupChat(user) {
    username = user;
    loadContacts();
    openChatConnection();
}

function loadContacts() {
    fetch('/api/drivers/')
        .then(response => response.json())
        .then(data => {
            const drivers = data;
            createContactDiv('Dispatcher');
            drivers.forEach(driver => {
                if (driver.name !== username){
                    messagesDictionary[driver.name] = [];
                    createContactDiv(driver.name);
                }
           })
        });
}

function createContactDiv(name) {
    const contactsPanel = document.getElementById('chat-box-contacts-panel');
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('chat-box-contact');
    contactDiv.innerHTML = name;
    contactDiv.addEventListener('click', handleContactDivClick);
    contactsPanel.appendChild(contactDiv);
}

function handleContactDivClick(e) {
    if (document.getElementsByClassName('selected-contact').length > 0) {
        document.getElementsByClassName('selected-contact')[0].classList.remove('selected-contact');
    }
    const recipient = e.target.innerHTML;
    currentContact = recipient;
    e.target.classList.add('selected-contact');
    document.getElementById('chat-box-header').innerHTML = `${recipient}`;
    removeChileNodes(document.getElementById('chat-box-msg-display'));
    document.getElementById('chat-box-msg-display');
    for (message of messagesDictionary[recipient]) {
        displayMessage(message);
    }
}

function removeChileNodes(element) {
    while (element.hasChildNodes()) {   
        element.removeChild(element.firstChild);
    }
}

function displayMessage(message){
    let messageDiv = document.createElement('div');
        if (message.sender === username) {
            messageDiv.classList.add('self-message-bubble');
        } else {
            messageDiv.classList.add('other-message-bubble');
        }
        messageDiv.classList.add('message-bubble');
        messageDiv.innerText = `${message.sender}: ${message.message}`;
        document.getElementById('chat-box-msg-display').append(messageDiv);
        document.getElementById('chat-box-msg-display').scrollTop = document.getElementById('chat-box-msg-display').scrollHeight;
}

function toggleChat() {
    document.getElementById('chat-box').classList.toggle('hidden');
}

//Event Listeners
document.getElementById('msg-bubble').addEventListener('click', toggleChat);

document.getElementById('chat-send-btn').addEventListener('click', (event) => {
    let data = {
        sender: username,
        receipient: document.getElementById('chat-box-header').innerHTML,
        message: document.getElementById('message-box').value
    }
    console.log('recepient', data.receipient);
    connection.send(JSON.stringify(data));
    document.getElementById('message-box').value = '';
    document.getElementById('sending-audio').play();
});
