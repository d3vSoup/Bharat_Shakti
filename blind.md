# Bharat Shakti — Blind Mode: Final Implementation Draft & Roadmap

> This document is the ultimate blueprint for building and expanding Blind Mode. It breaks down the feature roadmap into prioritized categories designed to maximize impact, usability, and appeal during hackathon pitches. It includes exact steps on *how* to build them and resources to help.

---

## 🌟 VERY IMPORTANT (Must Build First - Core Usability)

These features take the app from a "cool prototype" to a genuinely usable tool for blind students. Without these, the student cannot write a basic sentence or participate in an Indian classroom.

### 1. Complete Braille Character Set (Numbers, Caps, Punctuation)
**What to do:** Expand the current 26-letter virtual Perkins keyboard (`a-z`) to support numbers (using the number indicator `⠼`), capital letters (using the cap indicator `⠠`), and punctuation.

**How to do it (Steps):**
1. **Update State Management:** Modify `commit()` in `blind.html` to track "modes". If the student types `dots 3-4-5-6` (number indicator), set a flag `isNumberMode = true`.
2. **Handle Next Keystroke:** If `isNumberMode` is true, map `a-j` (dots 1-0) to digits `1-9, 0`.
3. **Punctuation Dictionary:** Add punctuation patterns to the `BRAILLE` JS object (e.g., `"010011": "."` for period).
4. **TTS Updates:** Ensure the `tts()` function reads "Capital A" or "Number 5".

**Resources & Links:**
- [Standard English Braille Chart (Braille Authority)](https://www.brailleauthority.org/)
- [JavaScript State Machines Tutorial](https://xstate.js.org/docs/guides/statenodes.html) (Helpful for managing braille prefix states)

---

### 2. Bharati Braille (Hindi Braille) Support
**What to do:** Implement Bharati Braille, the unified braille standard for Indian languages. A blind student in India must be able to read and write in Hindi.

**How to do it (Steps):**
1. **Add Language Toggle:** Create a UI button (and keyboard shortcut like `Ctrl+L`) to toggle between English and Hindi Braille modes.
2. **Create Bharati Dictionary:** Map 6-dot patterns to Devanagari Unicode characters (e.g., `dots 1-3` = "क").
3. **Matra Logic:** Handle Hindi vowels (Matras) which attach to consonants. When a consonant is followed by a matra braille pattern, combine them into a single Devanagari character string before rendering.
4. **Hindi TTS:** Ensure `window.speechSynthesis` switches to `hi-IN` when in this mode.

**Resources & Links:**
- [Bharati Braille Chart (Wikipedia)](https://en.wikipedia.org/wiki/Bharati_Braille)
- [Web Speech API Language Codes (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/lang)

---

## 🚀 HIGH APPEAL TO JUDGES (The "Wow" Factor)

These are the features that win hackathons. They are highly visual, technically impressive, and solve massive real-world problems.

### 3. Live Board OCR & Teacher Broadcast
**What to do:** Allow a teacher to point their phone at a blackboard, extract the handwriting, and broadcast it to the blind student as audio and a Braille-ready document.

**How to do it (Steps):**
1. **Camera Capture:** Build a hidden teacher page that accesses the webcam (`navigator.mediaDevices.getUserMedia`).
2. **Frame Extraction:** Use a `<canvas>` to capture a frame every 5 seconds.
3. **Send to Gemini Vision API:** Base64 encode the image and send it to the Gemini API with the prompt: *"Extract all handwritten text on this board. Output only the text."*
4. **Broadcast via WebSocket:** Send the extracted text through the existing FastAPI WebSocket channel to the blind student.
5. **Render:** The blind student's frontend receives it, logs it, and `tts()` reads it aloud automatically.

**Resources & Links:**
- [Google Gemini Vision API Docs](https://ai.google.dev/docs/gemini_api_developer_guide)
- [MDN WebRTC / getUserMedia Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos)
- [FastAPI WebSockets Guide](https://fastapi.tiangolo.com/advanced/websockets/)

---

### 4. Braille-to-Text Exam Mode with PDF Export
**What to do:** Let the blind student write an exam in Braille and generate a perfectly formatted English/Hindi PDF for the teacher to grade.

**How to do it (Steps):**
1. **Build the UI:** Add a "Start Exam" button that locks the screen and starts a visible/audible countdown timer.
2. **Auto-Save:** Save the `outputText` to `localStorage` every 10 seconds to prevent data loss if the browser crashes.
3. **Generate PDF:** Integrate `jsPDF`. When the student hits "Submit", take the English text, add a header (Name, Date, Word Count), and generate a PDF blob.
4. **Download/Send:** Trigger an automatic download of the PDF or send it to the backend.

**Resources & Links:**
- [jsPDF Library (GitHub)](https://github.com/parallax/jsPDF)
- [Using LocalStorage (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

### 5. Spatial Audio & Earcons (Sound Design)
**What to do:** Blind users navigate the world via sound. Replace basic TTS with a rich, spatial audio environment where UI elements have distinct sounds (Earcons).

**How to do it (Steps):**
1. **Audio Context:** Initialize `const audioCtx = new (window.AudioContext || window.webkitAudioContext)();`
2. **Create Oscillators:** Instead of MP3 files, synthesize short "clicks" for the Braille keys.
3. **Spatial Panning:** Use `StereoPannerNode`. 
   - Left hand keys (`S, D, F`) pan to `-1.0` (Left ear).
   - Right hand keys (`J, K, L`) pan to `1.0` (Right ear).
4. **Pitch Variation:** Make Dot 1 a high pitch (e.g., 800Hz) and Dot 3 a low pitch (400Hz). 
5. **Chimes:** Play a pleasant chord when `SPACE` (commit) is pressed.

**Resources & Links:**
- [Web Audio API Spatialization (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics)
- [UI Sound Design Best Practices](https://material.io/design/sound/sound-resources.html)

---

## 💡 IMPORTANT (Polish & Core UX)

These features make the app feel professional and robust.

### 6. Voice-to-Braille Converter (Learning Mode)
**What to do:** Allow the student to speak a word and see/hear how it is spelled in Braille dots. Great for beginners learning Braille.

**How to do it (Steps):**
1. **Speech Recognition:** Use `webkitSpeechRecognition` to capture the student's voice.
2. **String to Dots:** Map the recognized word character-by-character back to the `BRAILLE` dictionary values.
3. **Audio Playback:** String together TTS commands: *"H is dots 1 2 5. E is dots 1 5..."*

**Resources & Links:**
- [Web Speech API (SpeechRecognition) Docs](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)

### 7. Full Keyboard Audio Navigation
**What to do:** Ensure a blind user never has to use a mouse.

**How to do it (Steps):**
1. **Global Key Listener:** Add an event listener for `keydown`.
2. **Shortcuts:** Implement `Ctrl + 1` (Focus Keyboard), `Ctrl + 2` (Focus Output), `Ctrl + R` (Read All).
3. **Aria Labels:** Ensure every HTML section has `aria-live="polite"` and distinct `aria-label` tags.

---

## 🌠 MOONSHOTS (The Future Vision)

Mention these in the pitch to show the long-term scale of the project.

### 8. Physical Refreshable Braille Display Integration
Use the **WebHID API** to connect the browser directly to physical USB/Bluetooth Braille displays (like the Orbit Reader). This allows Bharat Shakti to act as the software engine for expensive hardware.
- [WebHID API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API)
- [Google Chrome WebHID Examples](https://googlechromelabs.github.io/webhid/)

### 9. Nemeth Braille for Mathematics
Implement Nemeth Braille so students can type algebraic equations, fractions, and calculus directly into the browser, which renders it using KaTeX or MathJax for the teacher.
- [Nemeth Braille Rules](https://www.brl.org/nemeth/)
- [MathJax Library](https://www.mathjax.org/)

---

## 📋 Hackathon Pitch Cheat Sheet (Blind Mode)

If a judge asks *"Why did you build Blind Mode like this?"*, use these points:
1. **"We didn't build a screen reader; we built a native Braille environment."** (Emphasizes that you understand blind UX is different from sighted UX).
2. **"It replaces ₹45,000 hardware with an ₹8,000 laptop."** (Emphasizes affordability and scale for India).
3. **"It's bi-directional."** (The student isn't just listening; they are typing back to the teacher).
4. **"Bharati Braille natively supports the 22 scheduled languages of India."** (Emphasizes the localization and "Bharat" aspect).
