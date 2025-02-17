import asyncio
import websockets

# Store all connected clients
connected_clients = set()

async def broadcast(message):
    """Broadcast a message to all connected clients."""
    if connected_clients:
        await asyncio.wait([client.send(message) for client in connected_clients])

async def handle_client(websocket, path):
    """Handle a new client connection."""
    # Add the new client to the set of connected clients
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            # Broadcast the received message to all clients
            await broadcast(f"Client says: {message}")
    finally:
        # Remove the client when they disconnect
        connected_clients.remove(websocket)

async def start_server(port):
    """Start the WebSocket server."""
    async with websockets.serve(handle_client, "localhost", port):
        print(f"Server started on ws://localhost:{port}")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2 or sys.argv[1] != "start":
        print("Usage: python server.py start")
        sys.exit(1)

    port = 8768  # You can change this port if needed
    asyncio.get_event_loop().run_until_complete(start_server(port))