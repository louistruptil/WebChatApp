const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 5000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let items = [];

wss.on('connection', ws => {
    ws.send(JSON.stringify(items));
    ws.on('message', message => {
        const newItem = JSON.parse(message);
        items.push(newItem);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(items));
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
