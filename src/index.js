const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(path.resolve(__dirname + '/../public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
});

io.on('connection', (socket) => {
    console.log(socket.handshake.query.name + " connected!");
    io.emit('connection notification', socket.handshake.query.name);
    socket.on('disconnect', () => {
        console.log(socket.handshake.query.name + " disconnected!");
        io.emit('disconnection notification', socket.handshake.query.name);
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(3000, () => {
    console.log('Listening on *: 3000');
});