const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle script updates here
  socket.on('codeUpdate', (data) => {
    // Broadcast the code update to all other connected clients
    socket.broadcast.emit('codeUpdate', data);
  });
});

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
