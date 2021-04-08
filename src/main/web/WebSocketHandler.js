const WebSocketServer = require('websocket').server;
const CONFIG = require('../../../config/config');
const logger = require('../Loggers');

var wsServer = null;
var clients = [ ];

const WebSocketHandler = {

    initWebSocket(httpHandler, onConnectedCallBack) {
        wsServer = new WebSocketServer({
            httpServer: httpHandler
        });

        wsServer.on('request', function(request) {
            console.log('Connection from origin ' + request.origin + '.');

            var connection = request.accept(null, request.origin);
            var index = clients.push(connection) - 1;
          
            // This is the most important callback for us, we'll handle
            // all messages from users here.
            connection.on('message', function(message) {
              if (message.type === 'utf8') { // accept only text

                console.log('Received message:' + message.utf8Data);

                // process WebSocket message
                if (clients.length > 0) {
                    var json = JSON.stringify({ type:'message', data: 'Received msg...' });
        
                    for (var i = 0; i < clients.length; i++) {
                      clients[i].sendUTF(json);
                    }
                }
              }
            });
          
            connection.on('close', function(connection) {
                console.log("Peer " + connection.remoteAddress + " disconnected.");
                clients.splice(index, 1);
            });

            onConnectedCallBack(connection);
          });

    },
    sendToClient(connection, data) {
        if (wsServer == null) {
            console.log('WebSocketServer not initialized');
            return;
        }

        var json = JSON.stringify(data);

        connection.sendUTF(json);
    },
    broadcast(data) {
        if (wsServer == null) {
            console.log('WebSocketServer not initialized');
            return;
        }

        if (clients.length > 0) {
            var json = JSON.stringify(data);

            for (var i = 0; i < clients.length; i++) {
              clients[i].sendUTF(json);
            }
        }
    }
}

module.exports = WebSocketHandler;