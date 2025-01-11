const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');  // Import cors

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow all origins (or replace '*' with your local URL for security)
        methods: ["GET", "POST"]
    }
});

// Enable CORS for express
app.use(cors({
    origin: "*",  // Allow all origins (or replace '*' with your local URL for security)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Serve static files
app.use(express.static('public'));

// Setup Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userJoined', (user) => {
        console.log(`${user.username} has joined`);
        io.emit('userListUpdate', users); // Emit user list to all clients
    });

    socket.on('placeBet', (data) => {
        console.log(`${data.username} placed a bet on ${data.betSide} with ${data.amount} coins.`);
        // Update bet stats here
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});
