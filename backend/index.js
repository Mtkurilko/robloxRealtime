const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this to your frontend origin if needed
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createRoom', (roomId) => {
    console.log(`Creating room: ${roomId}`);
    socket.join(roomId);  // The user is placed in their own room
    socket.emit('roomCreated', roomId);  // Notify the user that the room has been created
  });

  // When a user joins an existing room
  socket.on('joinRoom', (roomId) => {
    console.log(`User ${socket.id} joining room: ${roomId}`);
    socket.join(roomId);  // Another user joins the room
    io.to(roomId).emit('userJoined', `${socket.id} has joined the room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle script updates here
  socket.on('codeUpdate', (data, roomId) => {
    // Broadcast the code update to all other connected clients
    socket.to(roomId).emit('codeUpdate', data);
  });
});

server.listen(4000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:4000');
});
