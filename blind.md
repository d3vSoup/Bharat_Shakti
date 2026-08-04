# Bharat Shakti — Blind Mode: Features, Philosophy & Roadmap

> This is a living document. It captures what Blind Mode does, what it needs to do, what makes it unique, and the features we're planning.

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

## ❌ What's Missing — Critical Gaps

### Can You Type Every Word? **Almost, But Not Quite.**

The current Braille map only covers `a`–`z` (26 lowercase letters). That means:

| Can Type | Can't Type |
|---|---|
| All lowercase letters (a–z) | **Numbers (0–9)** |
| Spaces (empty pattern) | **Capital letters** (needs Braille shift prefix) |
| | **Punctuation** (period, comma, question mark, etc.) |
| | **Hindi / Devanagari Braille** (Bharati Braille system) |
| | **Mathematical symbols** (+, −, ×, ÷, =) |
| | **Grade 2 Braille contractions** (shorthand for common words) |

**To type every word ever** — we need to add Braille number indicator, capital indicator, punctuation codes, and ideally Bharati Braille for Hindi.

---

## 🔑 Core USPs — What Makes Blind Mode Unique

### 1. It's a Virtual Perkins Brailler, Not a Screen Reader Overlay

Most accessibility tools are screen reader overlays (NVDA, JAWS, VoiceOver) that narrate existing visual interfaces. **We're not overlaying an existing screen — we built an entirely new Braille-native interface from scratch.**

The student doesn't navigate a visual UI with a screen reader. They interact with a **purpose-built Braille keyboard** that thinks in dots, not pixels.

### 2. Zero Hardware Dependency

A physical Perkins Brailler costs ₹15,000–₹45,000. Refreshable Braille displays cost ₹1,50,000+.

Our virtual Perkins keyboard runs on **any laptop or tablet keyboard** — the same ₹8,000 hardware that runs Deaf Mode. No special equipment, no procurement budget.

### 3. Bidirectional Classroom Integration

The blind student isn't isolated:
- **Teacher → Student**: Teacher's voice broadcasts arrive as TTS audio in real-time.
- **Student → Teacher**: Student types in Braille → system shows English text → teacher reads it on their screen.

This is two-way classroom participation, not a passive listening tool.

### 4. Audio-First Design Philosophy

Every single interaction produces audio feedback. The student never has to wonder "did that work?" or "what did I just press?". This is not just accessibility — it's **confidence-building UX**.

---

## 🚀 Features Needed — Full Roadmap

### Tier 1: Essential (Must Build)

#### 📊 A. Complete Braille Character Set

Expand from 26 letters to the full Grade 1 Braille standard:

**Numbers (with number indicator ⠼):**
- Braille uses the SAME patterns as `a`–`j` for digits `1`–`0`, preceded by a number indicator (dots 3-4-5-6).
- E.g., `⠼⠁` = "1", `⠼⠃` = "2", etc.

**Capital letters (with capital indicator ⠠):**
- A capital indicator (dot 6) before a letter makes it uppercase.
- E.g., `⠠⠁` = "A", `⠠⠃` = "B".

**Punctuation:**
| Character | Braille Dots |
|---|---|
| Period `.` | 2-5-6 |
| Comma `,` | 2 |
| Question `?` | 2-3-6 |
| Exclamation `!` | 2-3-5 |
| Apostrophe `'` | 3 |
| Hyphen `-` | 3-6 |
| Colon `:` | 2-5 |
| Semicolon `;` | 2-3 |

**This is non-negotiable.** Without numbers and punctuation, a student can't write a single math answer, date, or proper sentence.

---

#### 🇮🇳 B. Bharati Braille (Hindi Braille) Support

Indian blind students read and write in **Bharati Braille** — the unified Braille code for Indian languages. This is NOT the same as English Braille.

Bharati Braille maps Devanagari consonants and vowels to specific dot patterns:
- **Vowels**: अ = dots 1, आ = dots 3-4-5, इ = dots 2-4, etc.
- **Consonants**: क = dots 1-3, ख = dots 4-6, ग = dots 1-2-4-5, etc.
- **Matras (vowel modifiers)**: ा = dot 5-6, ि = dot 2-4, etc.

**Allow a toggle between English Braille mode and Hindi Bharati Braille mode** — just like Deaf Mode switches between English and Hindi.

---

#### 🔊 C. Teacher Lecture Audio Player (The "Board Reader")

A blind student can hear the teacher speak — but they **can't see what's on the board.**

When the teacher writes on a whiteboard or shares slides, the blind student gets nothing. We need:
- A text input on the **teacher's side** where they type/paste board notes or slide bullet points.
- These notes are broadcast to the blind student and **read aloud automatically** via TTS.
- The student can **replay any note** — pause, rewind, speed up.
- Notes are stored in the session log for later study.

This is the blind equivalent of what ISL signs do for deaf students — making the visual content audible.

---

#### 📝 D. Braille-to-Text Exam Mode

For exams and assessments:
- Student types answers in Braille.
- System converts to English text in real-time.
- Teacher sees the English text on their dashboard.
- **Word count** displayed (spoken aloud on request).
- **Timer** with audio alerts ("5 minutes remaining").
- **Auto-save** to prevent accidental loss.
- **Export to PDF** — the teacher gets a printable copy of the student's exam.

---

#### 🧭 E. Full Audio Navigation (No Mouse, No Eyes)

The entire application must be navigable by keyboard with audio cues:
- **Tab order** must be logical and linear (not random DOM order).
- Every section announces itself when focused: *"You are now in the Perkins Keyboard section."*
- Custom keyboard shortcuts:
  - `Ctrl+1` = Jump to Keyboard
  - `Ctrl+2` = Jump to Text Output
  - `Ctrl+3` = Jump to Classroom Feed
  - `Ctrl+R` = Read all output
  - `Ctrl+C` = Clear output
  - `Ctrl+H` = Help / list all shortcuts (spoken aloud)

---

### Tier 2: High-Impact Features

#### 📖 F. PDF/Textbook Reader (Read-Aloud Engine)

The teacher uploads a PDF or textbook chapter. The system:
- Extracts text from the PDF (using `pdf.js` or backend OCR).
- Converts to structured Braille for display.
- Reads aloud with **adjustable speed** and **voice selection**.
- Student can navigate by **paragraph**, **sentence**, or **word** using arrow keys.
- **Bookmark** specific paragraphs for later review.

This replaces the physical Braille textbook — which is often unavailable, expensive (₹2,000+ per book), and bulky.

---

#### 🧮 G. Mathematics in Nemeth Braille

Math is the hardest subject for Braille users because standard Braille can't represent fractions, exponents, or equations.

**Nemeth Braille** is the standard for math:
- `⠹⠂⠌⠆⠼` = ½ (one-half)
- `⠭⠘⠆` = x² (x squared)

Build a **Nemeth math entry mode** where the student can:
- Enter equations in Nemeth Braille.
- System displays the equation visually for the teacher.
- Teacher sees: `x² + 3x - 7 = 0` while the student typed in Nemeth dots.

---

#### 🗣️ H. Voice-to-Braille Converter

Reverse the Perkins keyboard — let the student **speak** and the system:
- Transcribes speech to text (Web Speech API).
- Converts text to **Braille dot patterns** displayed on screen.
- Speaks back: "You said 'hello'. That is dots 1-2-5, dots 1-5, dots 1-2-3, dots 1-2-3, dots 1-3-5."

This helps students **learn Braille** by hearing the dot patterns for words they speak.

---

#### 🎵 I. Audio Earcons and Sound Design

Replace text-only TTS feedback with rich audio design:
- **Dot on**: a short, distinct click (different pitch per dot position).
- **Character committed**: a satisfying confirmation chime.
- **Error (unknown pattern)**: a gentle buzz.
- **Teacher broadcast arrives**: a notification bell.
- **Navigation between sections**: a subtle whoosh.

This creates **spatial audio navigation** — the student knows where they are by the sound, not just the words.

---

#### 🌐 J. Multi-Language TTS (Hindi + English)

Current TTS only speaks in English (`en-IN`). Add:
- **Hindi TTS voice** for Hindi content.
- **Auto-detect language** of the classroom broadcast and switch TTS voice accordingly.
- **Voice selection** — let the student choose between male/female, speed, and accent.

---

### Tier 3: Advanced & Moonshot

#### 🤖 K. AI Study Companion (Voice-Activated Assistant)

A voice-activated AI assistant embedded in Blind Mode:
- *"Summarise today's lesson"* → reads a summary of all classroom broadcasts.
- *"Spell the word 'photosynthesis'"* → spells it in Braille dot patterns.
- *"What's 7 × 8?"* → "Fifty-six. In Braille, that is number indicator, dots 1-2-5-6, dots 1-2-4-5-6."
- *"Read my last paragraph"* → reads back the student's own typed text.

This turns the tool from a passive keyboard into an **active learning companion**.

---

#### 📱 L. Refreshable Braille Display Integration (WebHID)

For schools that DO have refreshable Braille displays (rare but growing):
- Use the **WebHID API** to connect to USB/Bluetooth Braille displays directly from the browser.
- Output text to the physical pins in real-time.
- Receive Braille key input from the physical device.

This bridges the gap between our software Braille and physical Braille hardware — making Bharat Shakti the software layer for any Braille device.

---

#### 🏫 M. Classroom Spatial Audio (Where Is the Teacher?)

Use the **Web Audio API** with 3D spatialization:
- Teacher's voice comes from the "front" of the stereo field.
- System notifications come from the "right".
- Student's own TTS feedback comes from the "left".

This creates an **audio spatial map** of the classroom — the student can tell the difference between the teacher, the system, and their own typing feedback by direction alone.

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
| Free | ✅ | ✅ (NVDA) | ✅ (built-in) | ✅ |
| Web-based (no install) | ✅ | ❌ (desktop app) | ❌ (OS-level) | ❌ (Android) |

---

## 💡 Open Discussion Points

- **[ ] Discuss**: Should Bharati Braille be a separate mode toggle, or auto-detected from the classroom language?
- **[ ] Discuss**: For the exam mode — should the timer be enforced (auto-submit) or advisory (student decides)?
- **[ ] Discuss**: Grade 2 Braille (contractions/shorthand) — add it? It's what fluent Braille readers actually use day-to-day.
- **[ ] Discuss**: Should we support simultaneous Braille input + voice input (hybrid mode)?
- **[ ] Discuss**: How to handle the teacher's slides/board content — OCR on screenshots, or manual teacher text input?
- **[ ] Discuss**: WebHID for physical Braille displays — is this realistic for the hackathon demo, or is it a post-hackathon stretch?

---

*Last updated: August 2026 | Bharat Shakti Team*
