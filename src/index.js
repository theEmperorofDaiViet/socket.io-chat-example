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
    console.log("A user connected!");
    socket.on('disconnect', () => {
        console.log("User disconnected!");
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(3000, () => {
    console.log('Listening on *: 3000');
});