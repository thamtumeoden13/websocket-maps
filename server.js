import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'http';
import express from 'express'

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message, isBinary) {
        console.log(message.toString(), isBinary);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});
// wss.on('connection', function connection(ws, request, client) {
//     console.log('connection')
//     ws.on('message', function message(data) {
//         console.log(`Received message ${data} from user ${client}`);
//     });
// });

// server.on('upgrade', function upgrade(request, socket, head) {
//     // This function is not defined on purpose. Implement it with your own logic.
//     authenticate(request, function next(err, client) {
//         if (err || !client) {
//             socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//             socket.destroy();
//             return;
//         }

//         wss.handleUpgrade(request, socket, head, function done(ws) {
//             wss.emit('connection', ws, request, client);
//         });
//     });
// });


app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(1337, () => {
    console.log("Listening to port 1337");
});

// I'm maintaining all active connections in this object
const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wss.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
});