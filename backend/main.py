import json
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Bharat Shakti - Inclusive Classroom Backend")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        # Keep track of active connections categorized by student type / teacher
        self.active_connections: List[WebSocket] = []

    async def accept(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Send json message to all active WebSocket clients
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                # Handle dead connections gracefully
                print(f"Error sending message to client: {e}")

manager = ConnectionManager()

@app.websocket("/ws/student/{mode}")
async def websocket_endpoint(websocket: WebSocket, mode: str):
    await manager.accept(websocket)
    print(f"Client joined classroom. Mode: {mode}")
    try:
        while True:
            # Wait for incoming messages from clients (e.g. Speech text from teacher)
            data = await websocket.receive_text()
            message_obj = json.loads(data)
            
            if message_obj.get("type") == "speech_input":
                # Broadcast teacher's transcription to all connected student screens
                lang = message_obj.get("lang", "en")
                print(f"Broadcasting speech input [{lang}]: {message_obj['text']}")
                await manager.broadcast({
                    "type": "broadcast",
                    "text": message_obj["text"],
                    "lang": lang
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Client left classroom. Mode: {mode}")

# Mount static frontend files to easily run everything in one server
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
else:
    @app.get("/")
    def read_root():
        return {"status": "Backend running, frontend directory not found locally"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
