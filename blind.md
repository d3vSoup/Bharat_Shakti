# Bharat Shakti — Blind Mode: Final Implementation Draft & Roadmap

> This is a living document. It captures what Blind Mode does, what it needs to do, what makes it unique, and the ultimate blueprint for building and expanding it. The feature roadmap is categorized to maximize impact, usability, and appeal during hackathon pitches.

---

## 👁️ What Does a Blind Student Actually Need in a Classroom?

Before listing features, let's think about what a blind student's school day actually looks like:

1. **Listening to the teacher lecture** — they hear fine, but can't see the board, slides, or textbook.
2. **Taking notes** — they can't use pen and paper. They need Braille or audio-based note-taking.
3. **Reading textbooks and assignments** — printed text is inaccessible. They need screen readers, audio, or Braille.
4. **Answering questions / writing exams** — they need to produce text output that the teacher can read.
5. **Navigating the app itself** — every button, every panel, every interaction must work without vision.

**Bharat Shakti's Blind Mode must solve ALL of these — not just the keyboard.**

---

## ✅ What's Already Built

### Perkins 6-Dot Braille Virtual Keyboard
- **Key mapping**: `S D F` (left hand: dots 3, 2, 1) and `J K L` (right hand: dots 4, 5, 6).
- **SPACE** commits the current dot pattern as a character.
- **BACKSPACE** deletes the last character.
- **ENTER** reads the entire output aloud.
- Full 26-letter English alphabet Braille mapping (`a`–`z`).

### Text-to-Speech (TTS) Audio Feedback & Live Feed
- Every dot toggle announces "Dot N on/off".
- Every committed character is spoken aloud instantly.
- Teacher broadcasts arrive via WebSocket and display in a Live Classroom Feed panel, spoken aloud automatically.

---

## ⚙️ The Core Architecture & Engine (Technical Deep Dive)

To scale this platform, we must solve fundamental hardware and performance bottlenecks.

### 1. Defeating "Keyboard Ghosting" (The Chording Problem)
**The Problem:** A physical Perkins Brailler requires the user to press multiple keys simultaneously (a "chord"). Standard laptop keyboards suffer from "hardware ghosting"—if a user presses S, D, F, and J at the exact same millisecond, cheap laptop hardware might drop a keystroke.
**The Solution:** Do not rely on simultaneous absolute keydown events.
- **Trigger Commit:** Let the user hold or tap the required dot keys in any order, and only register the Braille character when they tap the Spacebar. (Currently implemented).
- **Alternative Rapid Buffer:** Implement a 150ms buffer window. As long as keys are pressed within that tiny frame, group them as a single chord automatically.

### 2. The Core Translation Engine (C++ to WASM)
**The Problem:** JavaScript is often too slow and bloated for rapid, offline state management, especially when mapping complex Bharati Braille (Hindi) dictionaries.
**The Solution:** Move the core Braille-to-Text translation logic out of JS and build a WebAssembly (WASM) engine.
- Architect this using highly optimized, bare-metal C++. Because a 6-dot Braille cell has exactly 64 possible permutations, you can represent every character as a 6-bit integer (a bitmask).
- Write a hyper-minimalist C++ script using bitwise operations and dictionary lookups, bypassing standard libraries.
- Compile this to WASM. The browser will execute the Braille translation instantly, entirely offline, with a microscopic footprint.

### 3. Visualizing the Output (The Dual-Display)
**The Problem:** If the student types in Braille but the screen only shows English letters, it disconnects the learning experience and makes it harder for the teacher to understand *how* the student is typing.
**The Solution:** Use the Unicode Braille Patterns block (`U+2800` to `U+28FF`).
- When a chord is committed, the UI must immediately render the visual Braille dots on the screen.
- Directly underneath the Braille dots, render the translated English or Hindi text.
- This dual-display proves to judges that the translation engine works accurately on a character-by-character basis.

---

## 🌟 VERY IMPORTANT (Must Build First - Core Usability)

These features take the app from a "cool prototype" to a genuinely usable tool.

### A. Complete Character Set & The "Sticky" Modifiers
**What to do:** Expand the keyboard to support numbers and capital letters. In Braille, these aren't separate keys; they are prefixes.
**Implementation:** Build a simple state machine in JavaScript that intercepts the stroke.
- If the student types `⠼` (dots 3-4-5-6), set `isNumberMode = true` (a "sticky state"). The very next letter typed (`a` through `j`) is mathematically parsed as a number (`1` through `0`).
- Repeat for the Capital indicator `⠠` (dot 6).

### B. Bharati Braille Translator (Massive USP)
**What to do:** Instantly toggle the Perkins keyboard from English Grade-1 to Hindi Devanagari.
**Implementation:** Do not overcomplicate with ML. Bharati Braille maps directly to Devanagari Unicode. Build a robust dictionary mapping 6-dot arrays to Hindi Unicode characters (e.g., `dots 1-3` = `\u0915` for क).
- **GitHub Reference:** [evoluteur/braille-tools](https://github.com/evoluteur/braille-tools). Fork their array logic and replace English string outputs with Devanagari Unicode strings for an instant Bharati Braille parser.

---

## 🚀 HIGH APPEAL TO JUDGES (The "Wow" Factor)

### C. 3D Spatial Earcons (Never Done Before in SIH)
**What to do:** Standard TTS is too slow for a fast typist. Replace spoken "Dot 1" feedback with instantaneous, spatial audio cues.
**Implementation:** Abandon standard HTML `<audio>` tags. Use the native Web Audio API (`OscillatorNode`) to synthesize tones directly in the browser with zero latency.
- Map Dot 1 to a high-pitched "ping" in the left ear. Map Dot 6 to a low-pitched "thud" in the right ear. The student learns to type by melody and physical ear location, making it 10x faster.
- **GitHub Reference:** [Tone.js](https://github.com/Tonejs/Tone.js). A Web Audio framework that makes creating synths and panning left/right incredibly easy.

### D. Live Board OCR & Teacher Broadcast Sync
**What to do:** The teacher has a simple text input box labeled "Whiteboard", or points their phone camera at a physical board (using **Grok API / Gemini Vision API** to extract text).
**Implementation:** Rely purely on the existing FastAPI WebSocket architecture.
- Add a dedicated payload type (`type: 'BOARD_NOTE'`) that intercepts the student's typing session and forces a high-priority TTS read-out.
- This ensures the blind student never misses visual board notes.

### E. Client-Side Exam Exporter
**What to do:** The blind student takes their exam entirely in Braille. Hitting "Submit" generates a formatted PDF containing both English translation and visual Braille dots.
**Implementation:** Generate the PDF entirely on the client side (do not send to a backend; it will timeout on bad Wi-Fi).
- **GitHub Reference:** [MrRio/jsPDF](https://github.com/parallax/jsPDF). Pass your translated English state string and Braille Unicode string into jsPDF to generate a printable file instantly.

---

## 💡 IMPORTANT (UX Polish & Expansion)

### F. Voice-to-Braille Reverse Trainer
**What to do:** An active learning loop where a student holds Spacebar, speaks a word like "Apple", and the system verbally breaks down the exact Braille dot patterns required to spell it.
**Implementation:** Use the native `SpeechRecognition API` to capture the word, run it through the English-to-Braille JS array, and use `SpeechSynthesis` to read out the required dot arrays.

### G. Expanded Keyboard Navigation
**What to do:** Assign more keys on the standard keyboard to ensure full accessibility without a mouse.
**Implementation:** 
- `Ctrl+1/2/3` for section jumping.
- Arrow keys for navigating the Dual-Display output (reading back character by character).
- Use `aria-live` regions aggressively.

---

## 🌠 MOONSHOTS (The Future Vision)

### H. Physical Refreshable Braille Display Integration
Use the **WebHID API** to connect the browser directly to physical USB/Bluetooth Braille displays (like the Orbit Reader). This allows Bharat Shakti to act as the software engine for expensive hardware.

### I. Nemeth Braille for Mathematics
Implement Nemeth Braille so students can type algebraic equations and calculus directly into the browser, rendering it visually via MathJax for the teacher.

---

## 🧱 How Blind Mode Compares to Existing Solutions

| Feature | **Bharat Shakti** | NVDA / JAWS | Apple VoiceOver | BrailleBack |
|---|---|---|---|---|
| Built for Indian classrooms | ✅ | ❌ | ❌ | ❌ |
| Virtual Perkins keyboard | ✅ Native | ❌ | ❌ | ❌ |
| Bharati (Hindi) Braille | 🔜 Planned | ❌ | ❌ | Partial |
| Zero hardware needed | ✅ | ✅ | ✅ | ❌ (needs display) |
| Live classroom WebSocket | ✅ | ❌ | ❌ | ❌ |
| Audio-first design | ✅ Earcons | Overlay | Overlay | Partial |

---

## 📅 The 72-Hour Division of Labor (Sprint Plan)

To execute this during a hackathon, divide the team:

- **Member 1 (Linguistics & Core):** Map the Devanagari Unicode array for Bharati Braille, implement the "sticky" modifier logic for numbers/caps, and build the Dual-Display visualizer. *(Optional: Write the C++ bitmask engine and compile to WASM).*
- **Member 2 (Audio & UX):** Build the Web Audio API / `Tone.js` spatial earcons, map them to the 6 virtual keys, and implement the Voice-to-Braille Reverse Trainer.
- **Member 3 (Architecture & APIs):** Implement the `jsPDF` export for Exam Mode, wire up the Teacher's Board WebSocket payload, and integrate the Grok Vision API for board OCR.

---

*Last updated: August 2026 | Bharat Shakti Team*
