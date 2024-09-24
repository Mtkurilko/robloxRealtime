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

const roomContent = {};  // Store the content of each room

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle creating a room
  socket.on('createRoom', (roomId) => {
    console.log(`Creating room: ${roomId}`);
    socket.join(roomId);  // User joins their own room
    socket.emit('roomCreated', roomId);  // Notify the user that the room is created

    // If room has existing content, send it to the user who created the room
    if (roomContent[roomId]) {
      socket.emit('codeUpdate', roomContent[roomId]);  // Send the existing content to the creator
    } else {
      roomContent[roomId] = '';  // Initialize the room content if it doesn't exist
    }
  });

  // Handle joining an existing room
  socket.on('joinRoom', (roomId) => {
    console.log(`User ${socket.id} joining room: ${roomId}`);
    socket.join(roomId);  // Join the room

    // Notify the room that a new user has joined
    io.to(roomId).emit('userJoined', `${socket.id} has joined the room`);

    // Send the current content of the room to the new user
    if (roomContent[roomId]) {
      socket.emit('codeUpdate', roomContent[roomId]);  // Send only to the new joiner
    }
  });

  // Handle code updates
  socket.on('codeUpdate', (data, roomId) => {
    // Update the content for this room
    roomContent[roomId] = data;

    // Broadcast the code update to all other users in the room
    socket.to(roomId).emit('codeUpdate', data);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(4000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:4000');
});
