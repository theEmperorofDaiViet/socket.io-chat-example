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
        socket.broadcast.emit('finish typing', socket.handshake.query.name);
        console.log(socket.handshake.query.name + " disconnected!");
        io.emit('disconnection notification', socket.handshake.query.name);
    });
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('typing', () => {
        socket.broadcast.emit('typing', socket.handshake.query.name);
    });
    socket.on('finish typing', () => {
        socket.broadcast.emit('finish typing', socket.handshake.query.name);
    });
});

server.listen(3000, () => {
    console.log('Listening on *: 3000');
});