const socket = io("http://localhost:4000");

const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");

function sendMessage() {
    const username = usernameInput.value.trim() || "Anonymous";
    const message = messageInput.value.trim();

    if (message === "") return; // Prevent empty messages

    // Send message to server
    socket.emit("message", { username, message });

    messageInput.value = ""; // Clear input field
}

// Listen for incoming messages
socket.on("receive", (data) => {
    const { username, message, timestamp } = data;
    
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.innerHTML = `<strong>${username} (${timestamp}):</strong> ${message}`;
    
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to latest message
});

// Send message on "Enter" key press
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
