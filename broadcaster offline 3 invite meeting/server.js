const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:4000", // Restrict origin for security
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Enable JSON parsing

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Track users in rooms
const userRooms = {};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("joinRoom", ({ username, room }) => {
    if (!username || !room) {
      return socket.emit("error", "Username and room are required");
    }

    if (userRooms[socket.id]) {
      socket.leave(userRooms[socket.id].room);
      io.to(userRooms[socket.id].room).emit("userLeft", userRooms[socket.id].username);
      console.log(`User ${socket.id} left room: ${userRooms[socket.id].room}`);
    }

    socket.join(room);
    userRooms[socket.id] = { username, room };
    socket.to(room).emit("userJoined", username);

    const usersInRoom = Object.values(userRooms)
      .filter(user => user.room === room)
      .map(user => user.username);

    socket.emit("roomUsers", usersInRoom);
  });

  socket.on("message", ({ username, message, room }) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.to(room).emit("receive", { username, message, timestamp });
  });

  socket.on("typing", ({ username, room, isTyping }) => {
    socket.to(room).emit("userTyping", { username, isTyping });
  });

  socket.on("disconnect", () => {
    if (userRooms[socket.id]) {
      io.to(userRooms[socket.id].room).emit("userLeft", userRooms[socket.id].username);
      delete userRooms[socket.id];
    }
    console.log("User Disconnected:", socket.id);
  });
});

// Invite Link Handling
const inviteLinks = new Map();

function generateInviteLink(room, creator, expiresIn = 24) {
  const inviteId = crypto.randomBytes(6).toString('hex');
  const expirationTime = Date.now() + expiresIn * 3600000;
  inviteLinks.set(inviteId, { room, creator, expires: expirationTime });
  return inviteId;
}

app.post('/api/invite', (req, res) => {
  try {
    // Log the request body to check what is being sent
    console.log('Received request body:', req.body);

    const { room, username, hours } = req.body;

    // Check if the room and username are provided
    if (!room || !username) {
      return res.status(400).json({ success: false, message: 'Room and username required' });
    }

    // Generate the invite link
    const inviteId = generateInviteLink(room, username, hours || 24);
    console.log('Generated invite ID:', inviteId);

    // Send back the response with invite link
    res.json({
      success: true,
      inviteUrl: `http://localhost:4000/join/${inviteId}`,  // Full URL including localhost and port
      expires: new Date(inviteLinks.get(inviteId).expires)
    });
  } catch (error) {
    console.error('Error generating invite link:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/invite/:id', (req, res) => {
  const invite = inviteLinks.get(req.params.id);
  if (!invite || Date.now() > invite.expires) {
    inviteLinks.delete(req.params.id);
    return res.status(410).json({ success: false, message: 'Invite link has expired or is invalid' });
  }
  res.json({ success: true, room: invite.room });
});

app.get('/join/:inviteId', (req, res) => {
  console.log('Invite received:', req.params.inviteId); // Debugging line
  res.sendFile(path.join(__dirname, 'public', 'join.html'));
});

// Cleanup expired invites every hour
setInterval(() => {
  const now = Date.now();
  inviteLinks.forEach((invite, id) => {
    if (now > invite.expires) inviteLinks.delete(id);
  });
}, 3600000);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
