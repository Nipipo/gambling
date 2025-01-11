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

// In-memory users list
let users = [];

// Setup Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userJoined', (user) => {
        console.log(`${user.username} has joined`);
        users.push(user);  // Add user to the list when they join
        io.emit('userListUpdate', users); // Emit updated user list to all clients
    });

    socket.on('placeBet', (data) => {
        const user = users.find(u => u.username === data.username);
        if (user) {
            if (data.betSide === 'Yes') {
                user.yesBet += data.amount;
            } else {
                user.noBet += data.amount;
            }
        }
        io.emit('userListUpdate', users); // Emit updated user list to all clients
    });

    socket.on('updateCoins', (data) => {
        const user = users.find(u => u.username === data.username);
        if (user) {
            user.coins = data.coins;
        }
        io.emit('userListUpdate', users); // Emit updated user list to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users = users.filter(user => user.username !== socket.username);
        io.emit('userListUpdate', users); // Emit updated user list to all clients
    });
});

// Start the server
server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});
