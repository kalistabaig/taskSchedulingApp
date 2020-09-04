const WebSocket = require('ws');
const url = require('url');
const webSocketServer = new WebSocket.Server({ port: 8080 });

webSocketServer.on('connection', (webSocket, req) => {
    webSocket.send('who dis??');
    webSocket.on('message', (message) => {
        console.log('message:',message);
        const userNameIndicator = 'I B';
        if (message.startsWith(userNameIndicator)) {
            webSocket.username = message.substr(userNameIndicator.length + 1);
        } else {
            const messageObject = JSON.parse(message);
            console.log('Received:', messageObject);
            broadcast(messageObject);
        }
    });
  });
  
  function broadcast(messageObject) {
    webSocketServer.clients.forEach((client) => {
        console.log('username: ',client.username);
        // console.log('receipient: ',messageObject.receipient);
        // console.log(client.username === messageObject.receipient)
      if ((client.username === messageObject.receipient || client.username === messageObject.sender) && client.readyState === WebSocket.OPEN) {
          console.log('in the if');
        client.send(JSON.stringify(messageObject));
      }
    });
  }
