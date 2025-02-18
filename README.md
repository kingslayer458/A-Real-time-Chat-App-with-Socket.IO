# A Real time Chat App with Socket.IO

tutorial will be available soon

# Broadcaster Chat

A real-time chat application built with Node.js, Express, and Socket.IO that allows users to join different chat rooms and communicate instantly.

## Introduction

Broadcaster Chat is a modern real-time messaging platform that enables seamless communication between users in different chat rooms. It features a clean, responsive UI and supports core chat functionality like room-based conversations, typing indicators, and invite links.

![Broadcaster Chat Screenshot](https://via.placeholder.com/700x400?text=Broadcaster+Chat+Screenshot)

## How It Works

The application uses a client-server architecture:

1. **Backend**: A Node.js server with Express handles HTTP requests and Socket.IO manages real-time bidirectional communication.
2. **Frontend**: HTML, CSS, and JavaScript create a responsive user interface.
3. **Communication Flow**: When a user sends a message, it's transmitted via Socket.IO to the server, which then broadcasts it to all users in the same room.

## Features

- **Room-based chat**: Users can join different rooms for topic-specific conversations
- **Real-time messaging**: Instant message delivery using Socket.IO
- **Typing indicators**: See when other users are typing
- **Invite links**: Generate shareable links to invite others to specific rooms
- **Responsive design**: Works on desktop and mobile devices
- **User notifications**: System messages for user joining/leaving events
- **User-friendly interface**: Clean, modern UI with smooth animations

## Setup Guide

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/broadcaster-chat.git
   cd broadcaster-chat
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `public` directory and add the HTML files:
   ```bash
   mkdir -p public
   ```

4. Copy the provided HTML files:
   - Save the first HTML document as `public/index.html`
   - Save the second HTML document as `public/join.html`

5. Create the server file:
   ```bash
   # Save the third document as 'server.js'
   ```

### Configuration

1. You can customize the server port in `server.js` by changing the `PORT` variable.
2. Update the Socket.IO connection URL in `index.html`:
   ```javascript
   const socket = io("http://your-server-ip:4000");
   ```

### Running the Application

1. Start the server:
   ```bash
   node server.js
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:4000
   ```

## Using the Application

1. **Join a Room**:
   - Enter your username
   - Select a room from the dropdown
   - Click "Join Room"

2. **Send Messages**:
   - Type your message in the input field
   - Press Enter or click the Send button

3. **Generate Invite Links**:
   - Click the "Generate Invite Link" button
   - Share the provided link with others

## Customization

- **Colors**: Modify the gradient colors in the CSS to match your brand
- **Rooms**: Add or change available rooms by editing the options in the `roomSelect` dropdown
- **Message Styling**: Adjust the message bubble styles in the CSS

## Troubleshooting

- **Connection Issues**: Make sure the Socket.IO URL matches your server's IP address and port
- **Message Not Sending**: Check the browser console for any errors
- **Invite Links Not Working**: Ensure your server is accessible from the internet if sharing links externally

## Future Enhancements

- User authentication
- Message history persistence
- File sharing capabilities
- Custom room creation
- Emoji support
- Read receipts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
