const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Listen for new messages
    socket.on("message", (data) => {
        const { username, message } = data;
        const timestamp = new Date().toLocaleTimeString();
        
        // Broadcast message to all users
        io.emit("receive", { username, message, timestamp });
    });

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
