const WebSocket = require('ws');
const url = require('url');
const webSocketServer = new WebSocket.Server({ port: 8080 });

webSocketServer.on('connection', (webSocket, req) => {
    const params = url.parse(req.url, true);
    webSocket.username = params.query.username;
    console.log('websocket username', webSocket.username);
    webSocket.on('message', (message) => {
      const messageObject = JSON.parse(message);
      console.log('Received:', messageObject);
      broadcast(messageObject);
    });
  });
  
  function broadcast(messageObject) {
    webSocketServer.clients.forEach((client) => {
        console.log('username: ',client.username);
        console.log('receipient: ',messageObject.receipient);
        console.log(client.username === messageObject.receipient)
      if ((client.username === messageObject.receipient || client.username === messageObject.sender) && client.readyState === WebSocket.OPEN) {
          console.log('in the if');
        client.send(JSON.stringify(messageObject));
      }
    });
  }