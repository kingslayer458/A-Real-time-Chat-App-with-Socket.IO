const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // For development - restrict this in production
    methods: ["GET", "POST"]
  }
});

const PORT = 4000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Track users in rooms
const userRooms = {};

// Handle user connections
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  
  // Handle joining a room
  socket.on("joinRoom", ({ username, room }) => {
    // Leave previous room if any
    if (userRooms[socket.id]) {
      socket.leave(userRooms[socket.id].room);
      
      // Notify others that user has left
      io.to(userRooms[socket.id].room).emit("userLeft", userRooms[socket.id].username);
      
      console.log(`User ${socket.id} (${userRooms[socket.id].username}) left room: ${userRooms[socket.id].room}`);
    }
    
    // Join new room
    socket.join(room);
    userRooms[socket.id] = { username, room };
    
    // Notify room that user has joined
    socket.to(room).emit("userJoined", username);
    
    console.log(`User ${socket.id} (${username}) joined room: ${room}`);
    
    // Send current users in room
    const usersInRoom = Object.values(userRooms)
      .filter(user => user.room === room)
      .map(user => user.username);
    
    socket.emit("roomUsers", usersInRoom);
  });
  
  // Handle incoming messages
  socket.on("message", ({ username, message, room }) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.to(room).emit("receive", { username, message, timestamp });
  });
  
  // Handle user typing
  socket.on("typing", ({ username, room, isTyping }) => {
    socket.to(room).emit("userTyping", { username, isTyping });
  });
  
  // Handle user disconnections
  socket.on("disconnect", () => {
    if (userRooms[socket.id]) {
      // Notify room that user has left
      io.to(userRooms[socket.id].room).emit("userLeft", userRooms[socket.id].username);
      
      console.log(`User Disconnected: ${socket.id} (${userRooms[socket.id].username}) from room: ${userRooms[socket.id].room}`);
      
      // Remove user from tracking
      delete userRooms[socket.id];
    } else {
      console.log("User Disconnected:", socket.id);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`To access from other devices on your network, use your local IP address`);
});