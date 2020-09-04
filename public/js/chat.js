
loadContacts();
let connection;

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
            connection.send('I B ' + window.taskApp.username);
        } else {
            const data = JSON.parse(event.data);
            console.log('received', data);
            let messageDiv = document.createElement('div');
            if (data.sender === window.taskApp.username) {
                messageDiv.classList.add('self-message-bubble');
            } else {
                messageDiv.classList.add('other-message-bubble');
                document.getElementById('receiving-audio').play();
            }
            messageDiv.classList.add('message-bubble');
            messageDiv.innerText = `${data.sender}: ${data.message}`;
            document.getElementById('chat-box-msg-display').append(messageDiv);
        }
    };
}

function loadContacts() {
    fetch('/api/drivers/')
        .then(response => response.json())
        .then(data => {
            const drivers = data;
            createContactDiv('Dispatcher');
            drivers.forEach(driver => {
                createContactDiv(driver.name);
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
    e.target.classList.add('selected-contact');
    const chatPanelHeader = document.getElementById('chat-box-header');
    chatPanelHeader.innerHTML = `${recipient}`;

}

function toggleChat() {
    document.getElementById('chat-box').classList.toggle('hidden');

}

//Event Listeners

document.getElementById('msg-bubble').addEventListener('click', toggleChat);



document.getElementById('chat-send-btn').addEventListener('click', (event) => {
    let data = {
        sender: window.taskApp.username,
        receipient: document.getElementById('chat-box-header').innerHTML,
        message: document.getElementById('message-box').value
    }
    console.log('recepient', data.receipient);
    connection.send(JSON.stringify(data));
    document.getElementById('message-box').value = '';
    document.getElementById('sending-audio').play();
});
