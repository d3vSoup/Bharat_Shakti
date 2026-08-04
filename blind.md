# Bharat Shakti — Blind Mode: Features, Implementation Draft & Roadmap

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

### Text-to-Speech (TTS) Audio Feedback
- Every dot toggle announces "Dot N on/off".
- Every committed character is spoken aloud instantly.
- "Read All" reads the full output text.
- Teacher broadcasts are spoken: *"Teacher says: ..."*

### Live Classroom Feed (WebSocket)
- Teacher broadcasts arrive via WebSocket and display in a Live Classroom Feed panel.
- Each broadcast is spoken aloud automatically via TTS.

### Full Keyboard Accessibility
- All interactions work via physical keyboard (no mouse required).
- Focus rings on all interactive elements.
- `aria-live`, `aria-label`, `aria-pressed` attributes on all controls.

---

## 🔑 Core USPs — What Makes Blind Mode Unique

### 1. It's a Virtual Perkins Brailler, Not a Screen Reader Overlay
Most accessibility tools are screen reader overlays (NVDA, JAWS, VoiceOver) that narrate existing visual interfaces. **We're not overlaying an existing screen — we built an entirely new Braille-native interface from scratch.** The student interacts with a **purpose-built Braille keyboard** that thinks in dots, not pixels.

### 2. Zero Hardware Dependency
A physical Perkins Brailler costs ₹15,000–₹45,000. Refreshable Braille displays cost ₹1,50,000+. Our virtual Perkins keyboard runs on **any laptop or tablet keyboard** — the same ₹8,000 hardware that runs Deaf Mode. No special equipment, no procurement budget.

### 3. Bidirectional Classroom Integration
The blind student isn't isolated. **Teacher → Student**: Teacher's voice broadcasts arrive as TTS audio in real-time. **Student → Teacher**: Student types in Braille → system shows English text → teacher reads it on their screen.

### 4. Audio-First Design Philosophy
Every single interaction produces audio feedback. The student never has to wonder "did that work?" or "what did I just press?". This is not just accessibility — it's **confidence-building UX**.

---

## 🚀 HIGH APPEAL TO JUDGES (The "Wow" Factor)

These are the features that win hackathons. They are highly visual, technically impressive, and solve massive real-world problems.

### A. Live Board OCR & Teacher Broadcast (Powered by Grok API / xAI)
**What to do:** Allow a teacher to point their phone at a blackboard, extract the handwriting via Grok Vision, and broadcast it to the blind student as audio and a Braille-ready document.

**How to do it (Steps):**
1. **Camera Capture:** Build a hidden teacher page that accesses the webcam (`navigator.mediaDevices.getUserMedia`).
2. **Frame Extraction:** Use a `<canvas>` to capture a frame every 5 seconds.
3. **Send to Grok API:** Base64 encode the image and send it to the **xAI Grok API** (which supports fast multimodal vision) with the prompt: *"Extract all handwritten text on this board. Output only the text."*
4. **Broadcast via WebSocket:** Send the extracted text through the existing FastAPI WebSocket channel to the blind student.
5. **Render:** The blind student's frontend receives it, logs it, and `tts()` reads it aloud automatically.

**Resources & Links:**
- [xAI Grok API Documentation](https://console.xai.com/docs)
- [MDN WebRTC / getUserMedia Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos)
- [FastAPI WebSockets Guide](https://fastapi.tiangolo.com/advanced/websockets/)

### B. Braille-to-Text Exam Mode with PDF Export
**What to do:** Let the blind student write an exam in Braille and generate a perfectly formatted English/Hindi PDF for the teacher to grade.

**How to do it (Steps):**
1. **Build the UI:** Add a "Start Exam" button that locks the screen and starts a visible/audible countdown timer.
2. **Auto-Save:** Save the `outputText` to `localStorage` every 10 seconds to prevent data loss.
3. **Generate PDF:** Integrate `jsPDF`. When the student hits "Submit", take the English text, add a header (Name, Date, Word Count), and generate a PDF blob.
4. **Download/Send:** Trigger an automatic download of the PDF.

**Resources & Links:**
- [jsPDF Library (GitHub)](https://github.com/parallax/jsPDF)
- [Using LocalStorage (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### C. Spatial Audio & Earcons (Sound Design)
**What to do:** Blind users navigate the world via sound. Replace basic TTS with a rich, spatial audio environment where UI elements have distinct sounds (Earcons).

**How to do it (Steps):**
1. **Audio Context:** Initialize `const audioCtx = new (window.AudioContext || window.webkitAudioContext)();`
2. **Create Oscillators:** Synthesize short "clicks" for the Braille keys.
3. **Spatial Panning:** Use `StereoPannerNode`. Left hand keys (`S, D, F`) pan to `-1.0` (Left ear). Right hand keys (`J, K, L`) pan to `1.0` (Right ear).
4. **Chimes:** Play a pleasant chord when `SPACE` (commit) is pressed.

**Resources & Links:**
- [Web Audio API Spatialization (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics)

---

## 🌟 VERY IMPORTANT (Must Build First - Core Usability)

These features take the app from a "cool prototype" to a genuinely usable tool.

### D. Complete Braille Character Set (Numbers, Caps, Punctuation)
**What to do:** Expand the current 26-letter virtual Perkins keyboard (`a-z`) to support numbers (using the number indicator `⠼`), capital letters (using the cap indicator `⠠`), and punctuation. Without these, a student can't write a math answer, date, or proper sentence.

**How to do it (Steps):**
1. **Update State Management:** Modify `commit()` in `blind.html` to track "modes". If the student types `dots 3-4-5-6` (number indicator), set a flag `isNumberMode = true`.
2. **Handle Next Keystroke:** If `isNumberMode` is true, map `a-j` (dots 1-0) to digits `1-9, 0`.
3. **Punctuation Dictionary:** Add punctuation patterns to the `BRAILLE` JS object (e.g., `"010011": "."` for period).

**Resources & Links:**
- [Standard English Braille Chart (Braille Authority)](https://www.brailleauthority.org/)

### E. Bharati Braille (Hindi Braille) Support
**What to do:** Implement Bharati Braille, the unified braille standard for Indian languages. 

**How to do it (Steps):**
1. **Add Language Toggle:** Create a UI button (and keyboard shortcut like `Ctrl+L`) to toggle between English and Hindi Braille modes.
2. **Create Bharati Dictionary:** Map 6-dot patterns to Devanagari Unicode characters (e.g., `dots 1-3` = "क").
3. **Matra Logic:** Handle Hindi vowels (Matras) which attach to consonants. When a consonant is followed by a matra braille pattern, combine them into a single Devanagari character string before rendering.

**Resources & Links:**
- [Bharati Braille Chart (Wikipedia)](https://en.wikipedia.org/wiki/Bharati_Braille)

---

## 💡 IMPORTANT (UX Polish)

### F. Voice-to-Braille Converter (Learning Mode)
**What to do:** Allow the student to speak a word and hear/see how it is spelled in Braille dots.
**How to do it (Steps):** Use `webkitSpeechRecognition` to capture voice, map recognized letters to the `BRAILLE` dictionary, and use TTS to spell it out ("H is dots 1 2 5...").
- [Web Speech API Docs](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)

### G. Full Keyboard Audio Navigation
**What to do:** Ensure a blind user never has to use a mouse.
**How to do it (Steps):** Add `keydown` listeners for shortcuts: `Ctrl+1` (Focus Keyboard), `Ctrl+2` (Focus Output). Ensure every HTML section has `aria-live="polite"`.

---

## 🌠 MOONSHOTS (The Future Vision)

### H. AI Study Companion
A voice-activated AI assistant embedded in Blind Mode. *"Summarise today's lesson"* reads a summary of all classroom broadcasts using the **Grok API**. *"What's 7 × 8?"* translates the answer into Braille dot patterns.

### I. Physical Refreshable Braille Display Integration (WebHID)
For schools that DO have refreshable Braille displays (rare but growing), use the **WebHID API** to connect to USB/Bluetooth Braille displays directly from the browser. Output text to the physical pins in real-time.
- [WebHID API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API)

### J. Nemeth Braille for Mathematics
Math is the hardest subject for Braille users. Build a Nemeth math entry mode where the student can type equations (`⠭⠘⠆` = x²) directly in Braille, which renders via MathJax.
- [Nemeth Braille Rules](https://www.brl.org/nemeth/)

---

## 🧱 How Blind Mode Compares to Existing Solutions

| Feature | **Bharat Shakti** | NVDA / JAWS | Apple VoiceOver | BrailleBack |
|---|---|---|---|---|
| Built for Indian classrooms | ✅ | ❌ | ❌ | ❌ |
| Virtual Perkins keyboard | ✅ Native | ❌ | ❌ | ❌ |
| Bharati (Hindi) Braille | 🔜 Planned | ❌ | ❌ | Partial |
| Zero hardware needed | ✅ | ✅ | ✅ | ❌ (needs display) |
| Live classroom WebSocket | ✅ | ❌ | ❌ | ❌ |
| Teacher broadcast → TTS | ✅ | ❌ | ❌ | ❌ |
| Student Braille → Teacher text | ✅ | ❌ | ❌ | ❌ |
| PDF textbook reader | 🔜 Planned | Partial | ✅ | ❌ |
| Math (Nemeth Braille) | 🔜 Planned | ❌ | ❌ | ❌ |
| Audio-first design | ✅ Every action | Overlay | Overlay | Partial |

---

## 📋 Hackathon Pitch Cheat Sheet (Blind Mode)

If a judge asks *"Why did you build Blind Mode like this?"*, use these points:
1. **"We didn't build a screen reader; we built a native Braille environment."** (Emphasizes that you understand blind UX is different from sighted UX).
2. **"It replaces ₹45,000 hardware with an ₹8,000 laptop."** (Emphasizes affordability and scale for India).
3. **"It's bi-directional."** (The student isn't just listening; they are typing back to the teacher).
4. **"Bharati Braille natively supports the 22 scheduled languages of India."** (Emphasizes the localization and "Bharat" aspect).
5. **"We leveraged Grok API for real-time board extraction."** (Shows cutting-edge multimodal AI use).

---

*Last updated: August 2026 | Bharat Shakti Team*
