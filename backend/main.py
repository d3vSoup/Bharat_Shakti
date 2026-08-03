import json
import urllib.request
import urllib.parse
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

# ── Language Detection ────────────────────────────────────────────────────────
@app.get("/detect-lang")
def detect_lang(text: str):
    """
    Detect whether input text is Hindi ('hi') or English ('en').
    Uses Google Translate's public language detection endpoint.
    Returns { lang: 'hi' | 'en', confidence: float }
    """
    import re

    # Fast path: Devanagari characters → definitely Hindi
    if re.search(r'[\u0900-\u097F]', text):
        return JSONResponse({"lang": "hi", "confidence": 1.0, "source": "devanagari"})

    # Call Google Translate unofficial detection endpoint (no API key needed)
    try:
        encoded = urllib.parse.quote(text[:200])  # cap at 200 chars
        url = (
            f"https://translate.googleapis.com/translate_a/single"
            f"?client=gtx&sl=auto&tl=en&dt=t&q={encoded}"
        )
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0"
        })
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
        # Response format: [[translations...], null, detected_lang, ...]
        detected = data[2] if len(data) > 2 else "en"
        lang = "hi" if detected in ("hi", "ur") else "en"
        return JSONResponse({"lang": lang, "confidence": 0.95, "source": "google"})
    except Exception as e:
        print(f"Language detection fallback: {e}")
        # Fallback: basic Hinglish word check
        hinglish = {"namaste","namaskar","aaj","kal","haan","nahi","kitab","shikshak",
                    "padhna","likhna","dhanyawad","shukriya","madad","achha","kaise","kyun"}
        words = set(text.lower().split())
        if words & hinglish:
            return JSONResponse({"lang": "hi", "confidence": 0.75, "source": "hinglish"})
        return JSONResponse({"lang": "en", "confidence": 0.5, "source": "fallback"})


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
