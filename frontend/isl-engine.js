/**
 * isl-engine.js — Bharat Shakti ISL NLP Pipeline
 *
 * Pipeline (inspired by satyam9090 + AI4Bharat INCLUDE approach):
 *   Raw text → Normalise → Detect lang → Transliterate Hindi
 *           → Tokenise → POS tag → SOV reorder → ISL gloss sequence
 *
 * Entirely runs in the browser. Zero server round-trips.
 */

import { lookupWord, fingerspell, HINDI_TO_ENGLISH } from './isl-dict.js';

// ── Stopwords (English & Hindi romanised) ─────────────────────────────────
const STOPWORDS_EN = new Set([
  'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being',
  'the', 'a', 'an', 'to', 'of', 'in', 'at', 'on', 'for',
  'and', 'or', 'but', 'with', 'by', 'from', 'about', 'into',
  'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would',
  'can', 'could', 'may', 'might', 'shall', 'should', 'this',
  'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
  'he', 'she', 'we', 'you', 'i', 'me', 'my', 'your', 'our', 'her',
  'his', 'there', 'here', 'when', 'where', 'what', 'how', 'why',
  'which', 'who', 'whom', 'also', 'just', 'very', 'so', 'then',
  'than', 'too', 'up', 'out', 'if', 'as', 'not',
]);

// ── Lightweight rule-based POS tagger ─────────────────────────────────────
// Inspired by the NLP approach in satyam9090/Automatic-Indian-Sign-Language-Translator
const VERB_SUFFIXES    = ['ing', 'ed', 'en', 'ify', 'ise', 'ize', 'ate'];
const VERB_ROOTS       = new Set([
  'read', 'write', 'learn', 'study', 'understand', 'know', 'think',
  'answer', 'ask', 'tell', 'explain', 'listen', 'see', 'look', 'remember',
  'forget', 'repeat', 'complete', 'finish', 'speak', 'say', 'come', 'go',
  'sit', 'stand', 'walk', 'run', 'give', 'take', 'want', 'like', 'love',
  'eat', 'drink', 'work', 'play', 'help', 'stop', 'open', 'close', 'use',
  'show', 'make', 'do', 'solve', 'draw', 'check', 'mark', 'count',
]);
const ADJ_SUFFIXES     = ['ful', 'less', 'ous', 'ive', 'ic', 'al', 'ent', 'ant', 'able', 'ible'];
const ADJ_WORDS        = new Set([
  'good', 'bad', 'big', 'small', 'new', 'old', 'fast', 'slow',
  'correct', 'wrong', 'easy', 'difficult', 'important', 'happy', 'sad',
  'angry', 'afraid', 'same', 'different', 'more', 'less',
]);

/**
 * Guess part-of-speech for a single word.
 * @param {string} word — lowercase
 * @returns {'NOUN'|'VERB'|'ADJ'|'UNK'}
 */
function posTag(word) {
  if (VERB_ROOTS.has(word)) return 'VERB';
  if (ADJ_WORDS.has(word)) return 'ADJ';
  for (const sfx of VERB_SUFFIXES) {
    if (word.length > sfx.length + 2 && word.endsWith(sfx)) return 'VERB';
  }
  for (const sfx of ADJ_SUFFIXES) {
    if (word.length > sfx.length + 2 && word.endsWith(sfx)) return 'ADJ';
  }
  return 'NOUN'; // default assumption for remaining content words
}

// ── Hindi detection ────────────────────────────────────────────────────────
/**
 * Check if the text contains Devanagari script (Hindi).
 */
export function isHindi(text) {
  return /[\u0900-\u097F]/.test(text);
}

// ── Hindi transliteration ──────────────────────────────────────────────────
/**
 * Translate Hindi words to English equivalents using built-in map.
 * Uses longest-match strategy for multi-word phrases.
 * @param {string} text — raw Hindi text
 * @returns {string} — English equivalent
 */
export function transliterateHindi(text) {
  let result = text;

  // Sort by length descending (longest phrase first) for greedy match
  const entries = Object.entries(HINDI_TO_ENGLISH).sort((a, b) => b[0].length - a[0].length);

  for (const [hindi, english] of entries) {
    // Use global replace (all occurrences)
    result = result.split(hindi).join(english);
  }

  // Remove any remaining Devanagari characters (unmapped words → fingerspell as ?)
  result = result.replace(/[\u0900-\u097F]+/g, w => {
    // Try to romanise loosely — map common consonants
    return '[' + w + ']'; // mark unmapped for caller visibility
  });

  return result.trim();
}

// ── SOV Reordering (core NLP logic) ───────────────────────────────────────
/**
 * Convert English SVO text to ISL SOV gloss sequence.
 *
 * Algorithm (based on AI4Bharat INCLUDE & satyam9090 pipeline):
 * 1. Lowercase, remove punctuation
 * 2. Split & filter stopwords
 * 3. POS-tag each remaining word
 * 4. Reorder: NOUN/ADJ tokens first, VERB tokens last (ISL SOV grammar)
 * 5. Return gloss array (uppercase strings)
 *
 * @param {string} text — normalised English text
 * @returns {string[]} — ISL gloss words, uppercase
 */
export function toISLGloss(text) {
  // Step 1: Normalise
  const clean = text.toLowerCase().replace(/[^a-z\s'-]/g, '').trim();
  if (!clean) return [];

  // Step 2: Tokenise & filter stopwords
  const tokens = clean.split(/\s+/)
    .map(w => w.replace(/['-]/g, ''))    // strip apostrophes/hyphens
    .filter(w => w.length > 1 && !STOPWORDS_EN.has(w));

  if (!tokens.length) return [text.toUpperCase()];

  // Step 3: POS tag
  const tagged = tokens.map(w => ({ word: w, pos: posTag(w) }));

  // Step 4: SOV reorder — NPs (NOUN+ADJ) first, VPs (VERB) last
  const nouns = tagged.filter(t => t.pos === 'NOUN' || t.pos === 'ADJ');
  const verbs = tagged.filter(t => t.pos === 'VERB');
  const unknown = tagged.filter(t => t.pos === 'UNK');

  // ISL SOV: Subject, Object, then Verb
  const ordered = [...nouns, ...unknown, ...verbs];

  // Step 5: Uppercase for gloss notation
  return ordered.map(t => t.word.toUpperCase());
}

// ── Full pipeline ──────────────────────────────────────────────────────────
/**
 * Master pipeline: raw speech text → ISL gesture sequence.
 *
 * @param {string} rawText — from mic / paste / clipboard
 * @param {'en'|'hi'} lang — language hint
 * @returns {{ gloss: string[], gestures: GestureEntry[] }}
 *   GestureEntry: { word: string, url: string, type: 'word'|'letter'|'space', label: string }
 */
export function processToISL(rawText, lang = 'en') {
  let text = rawText.trim();
  if (!text) return { gloss: [], gestures: [] };

  // 1. Hindi transliteration if needed
  if (lang === 'hi' || isHindi(text)) {
    text = transliterateHindi(text);
    // Strip any remaining bracket-marked unmapped tokens gracefully
    text = text.replace(/\[[^\]]*\]/g, '');
  }

  // 2. Get ISL gloss (SOV reorder)
  const gloss = toISLGloss(text);

  // 3. Build gesture sequence: word lookup → fingerspell fallback
  const gestures = [];
  for (const glossWord of gloss) {
    const entry = lookupWord(glossWord);
    if (entry) {
      gestures.push({ word: glossWord, ...entry });
    } else {
      // Fingerspell each letter
      const letters = fingerspell(glossWord);
      letters.forEach(l => gestures.push({ word: glossWord, ...l }));
    }
  }

  return { gloss, gestures };
}

// ── Inline SVG fallback (no network) ──────────────────────────────────────
/**
 * Generate a simple SVG data URL with a text label.
 * Used as onerror fallback so we never need external placeholder services.
 */
function makeFallbackSvg(label, bg = '#FFB800', fg = '#271900') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="200" viewBox="0 0 280 200">
    <rect width="280" height="200" fill="${bg}" rx="8"/>
    <text x="140" y="110" text-anchor="middle" dominant-baseline="middle"
          font-family="sans-serif" font-size="${label.length > 6 ? 28 : 38}"
          font-weight="800" fill="${fg}">${label}</text>
    <text x="140" y="170" text-anchor="middle"
          font-family="sans-serif" font-size="11" fill="${fg}" opacity="0.6">ISL Sign</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ── Gesture Renderer ───────────────────────────────────────────────────────
/**
 * Animate a gesture sequence in the given container.
 *
 * @param {GestureEntry[]} gestures
 * @param {HTMLElement} imgEl — the <img> element for the gesture
 * @param {HTMLElement} labelEl — element for word label
 * @param {HTMLElement} pillContainer — container for gloss pills
 * @param {number} durationMs — time per sign (ms)
 * @param {Function} onDone — callback when sequence ends
 * @param {Function} onStart — callback when first sign renders
 * @returns {{ cancel: Function }} — call cancel() to stop
 */
export function animateGestures(gestures, imgEl, labelEl, pillContainer, durationMs, onDone, onStart) {
  let idx = 0;
  let timer = null;
  let cancelled = false;

  // Build pills
  pillContainer.innerHTML = '';
  gestures.forEach((g, i) => {
    // Group same-word letters into one pill
    const prevWord = gestures[i - 1]?.word;
    if (g.type === 'letter' && g.word === prevWord) return;
    const pill = document.createElement('span');
    pill.id = `gp-${i}`;
    pill.dataset.gestureWord = g.word;
    pill.className = 'isl-pill';
    pill.textContent = g.word;
    pillContainer.appendChild(pill);
  });

  function activatePill(currentWord) {
    pillContainer.querySelectorAll('.isl-pill').forEach(p => {
      if (p.dataset.gestureWord === currentWord) {
        p.classList.add('active');
        p.classList.remove('done');
      } else if (!p.classList.contains('done')) {
        p.classList.remove('active');
      }
    });
  }

  function completePill(currentWord) {
    pillContainer.querySelectorAll(`.isl-pill`).forEach(p => {
      if (p.dataset.gestureWord === currentWord) {
        p.classList.remove('active');
        p.classList.add('done');
      }
    });
  }

  function showNext() {
    if (cancelled || idx >= gestures.length) {
      if (!cancelled && onDone) onDone();
      return;
    }

    const g = gestures[idx];

    // Crossfade image
    imgEl.classList.remove('gesture-visible');
    imgEl.classList.add('gesture-fade-out');

    // Activate current pill
    activatePill(g.word);

    // Update label
    if (labelEl) {
      labelEl.textContent = g.type === 'letter'
        ? `${g.word} (fingerspelling: ${g.label})`
        : g.word;
    }

    // Load image
    if (g.url) {
      imgEl.src = '';
      imgEl.onerror = null;
      imgEl.onload = () => {
        imgEl.classList.remove('gesture-fade-out');
        imgEl.classList.add('gesture-visible');
      };
      imgEl.onerror = () => {
        // Image failed — show local text fallback SVG (no network needed)
        imgEl.src = makeFallbackSvg(g.label || '?', '#FFB800', '#271900');
        imgEl.classList.remove('gesture-fade-out');
        imgEl.classList.add('gesture-visible');
        imgEl.onerror = null;
      };
      imgEl.src = g.url;
    } else {
      // No URL (space/punctuation): show placeholder
      imgEl.src = makeFallbackSvg(g.label || '?', '#f1eee7', '#837560');
      imgEl.classList.remove('gesture-fade-out');
      imgEl.classList.add('gesture-visible');
    }

    if (idx === 0 && onStart) onStart();

    // Check if this is last letter of a fingerspelled word — complete pill then
    const nextIsSameWord = gestures[idx + 1]?.word === g.word;
    if (!nextIsSameWord) {
      completePill(g.word);
    }

    idx++;

    // Speed: letters show faster than whole-word signs
    const delay = g.type === 'letter' ? Math.max(durationMs * 0.55, 500) : durationMs;
    timer = setTimeout(showNext, delay);
  }

  showNext();

  return {
    cancel() {
      cancelled = true;
      if (timer) clearTimeout(timer);
    }
  };
}
