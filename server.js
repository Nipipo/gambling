const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = []; // Store player data

app.use(express.static('public')); // Serve static files

// When a user connects
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current user list to the new client
    socket.emit('userList', users);

    // When a new user joins
    socket.on('join', (user) => {
        users.push(user);
        io.emit('userList', users); // Broadcast to all users
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('userList', users); // Broadcast to all users
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
