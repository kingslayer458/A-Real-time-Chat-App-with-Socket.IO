import asyncio
import websockets

async def connect_to_server():
    """Connect to the WebSocket server and send/receive messages."""
    uri = "ws://localhost:8768"
    async with websockets.connect(uri) as websocket:
        print("Connected to server. Type 'exit' to quit.")
        while True:
            message = input("Enter message: ")
            if message == "exit":
                break
            await websocket.send(message)
            response = await websocket.recv()
            print(f"Received: {response}")

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 2 or sys.argv[1] != "connect":
        print("Usage: python client.py connect")
        sys.exit(1)

    asyncio.get_event_loop().run_until_complete(connect_to_server())