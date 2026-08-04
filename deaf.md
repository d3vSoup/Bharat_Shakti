# Bharat Shakti — Deaf Mode: USP, Differentiation & Design Philosophy

> This is a living document. It captures our ongoing discussions about what makes the Deaf Mode genuinely unique, how it differs from existing tools, and how we frame it for the pitch.

---

## 🔑 The Core USP — What Makes This Genuinely Different

### 1. It Solves ISL (Indian Sign Language) — Not ASL
**This is the biggest one.**

Almost every sign language app in existence solves for **ASL (American Sign Language)** or **BSL (British Sign Language)**. The deaf community in India uses **ISL — Indian Sign Language** — which has its own completely distinct vocabulary, grammar, and regional variations.

ISL is spoken by **approximately 18 million deaf people in India**, yet there is nearly zero production-grade tooling built specifically for it. We are one of the very few projects that:
- Uses **real ISL gesture datasets** (not ASL repurposed for India).
- Has **real ISL animated GIFs** of actual hand gestures from Indian practitioners.
- Maps **Devanagari Hindi script characters** to their corresponding ISL signs.

**Existing tools ignore this entirely.** Spread the Sign, Signily, and others are ASL/BSL-first, with minimal and incomplete ISL coverage.

---

### 2. It Is a Classroom Broadcast System, Not an App

**Every existing sign language tool is a 1-person lookup tool.**

You open an app, you search a word, you see a sign. That's it.

**What we built is fundamentally different:**
- The **teacher speaks** at the front of the classroom.
- A **WebSocket broadcast system** sends ISL translations **simultaneously** to **every deaf student's screen** in real-time.
- Students do not need to do anything — the system is **passive for the student**.

This is a **synchronous classroom broadcast architecture** — not a dictionary. The analogy is the difference between a dictionary and a live interpreter at a lecture.

No existing product in the Indian EdTech market does this.

---

### 3. It Speaks Both Hindi AND English (With Real-Time Switching)

**Indian classrooms are inherently bilingual.** Teachers switch fluidly between Hindi and English mid-sentence (code-switching / Hinglish). Existing tools handle one language at a time.

Our 3-tier auto-detection pipeline handles this in real-time:
1. **Devanagari script regex** — instant detection if Hindi characters are present.
2. **Google Translate API** via backend — confirms language with confidence scoring.
3. **Hinglish dictionary fallback** — catches romanized Hindi words like "namaste", "shikshak", "dhanyawad".

This means a teacher can say *"Today हम पढ़ेंगे about photosynthesis"* and our system handles both words correctly in the same sentence — routing Hindi words to Hindi ISL signs and English words to English ISL signs.

No existing real-time speech-to-sign tool handles bilingual Hindi+English switching.

---

### 4. ISL Grammar is Linguistically Correct (SOV, Not SVO)

**This is the difference between a toy and a real tool.**

English uses **Subject-Verb-Object (SVO)** grammar: *"The student reads the book."*  
ISL uses **Subject-Object-Verb (SOV)** grammar: *"STUDENT BOOK READ."*

Every naive "sign language translator" just converts word-by-word in English order — which is **grammatically wrong** in ISL and produces incomprehensible output to a fluent ISL user.

Our NLP pipeline:
- Removes filler words (articles, auxiliary verbs, connectors).
- Reorders the sentence into correct ISL SOV structure.
- Applies stopword filtering appropriate for sign language (no "is", "the", "a", "are").

This linguistic accuracy is something that would impress a deaf ISL user — not just a judge.

---

### 5. Zero Hardware, Zero Installation, Runs in Any Browser

The biggest barrier to accessibility tools in Indian schools is **hardware and infrastructure constraints**.

Our platform:
- Runs entirely in the **browser** using the native **Web Speech API** — no app download, no plugins.
- Works on a **₹8,000 Android phone** or a school projector's laptop.
- Requires **zero setup** for students — they just open the URL.
- Works even on **slow internet** because all heavy assets (sign images/GIFs) are pre-cached from CDN on first load.

This makes it usable in **Tier-2 and Tier-3 Indian schools** where budget hardware is the norm.

---

## 🧱 How It Compares to Existing Solutions

| Feature | **Bharat Shakti** | Google Live Transcribe | Spread the Sign | Academic ISL Projects |
|---|---|---|---|---|
| Language | **ISL (Indian)** | None (text only) | ASL / BSL (partial ISL) | ISL (research only) |
| Real-Time Classroom Broadcast | ✅ WebSocket multi-user | ❌ Single device | ❌ Single device | ❌ |
| Hindi + English bilingual | ✅ Auto-detect + switch | ❌ | ❌ | ❌ |
| ISL Grammar (SOV) | ✅ NLP pipeline | ❌ | ❌ | Partial (research) |
| Needs hardware/app | ❌ Browser-only | App required | App required | Research lab only |
| Free at point of access | ✅ | ✅ (limited) | ❌ (paid) | ❌ |
| Works in Indian classroom | ✅ | Partial | ❌ | ❌ |
| Open and deployable | ✅ | ❌ (proprietary) | ❌ | Partial |

---

## 💡 Open Discussion Points (To Add More Here)

> *(This section captures ongoing design decisions and thoughts as we discuss them.)*

- **[ ] Discuss**: Should we add phoneme-level fingerspelling for words not in the ISL dictionary (e.g. proper nouns like "Einstein", "Maharashtra")?
- **[ ] Discuss**: How do we handle regional ISL dialect differences? (ISL is not fully standardized nationally.)
- **[ ] Discuss**: Can we add a "confidence score" shown to the teacher so they know when a translation is exact vs. fingerspelled approximation?
- **[ ] Discuss**: How do we showcase the SOV grammar transformation visually in the UI — perhaps a "gloss ribbon" showing the reordered words?

---

*Last updated: August 2026 | Bharat Shakti Team*
