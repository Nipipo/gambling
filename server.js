const io = require('socket.io')(server);
let users = []; 

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userJoined', (user) => {
        users.push(user);
        io.emit('userListUpdate', users); 
    });

    socket.on('placeBet', ({ username, betSide, amount }) => {
        io.emit('bettingUpdate', { yesBet: 0, noBet: 0 });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('userListUpdate', users); 
    });
});
