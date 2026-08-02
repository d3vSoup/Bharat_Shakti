/**
 * isl-dict.js — Bharat Shakti ISL Gesture Dictionary
 *
 * Real ISL images sourced from:
 *   - satyam9090/Automatic-Indian-Sign-Language-Translator (downloaded locally)
 *     • letters/a–z.jpg  → 1440×1080 real ISL hand photos
 *     • words/*.gif      → animated ISL gesture GIFs
 *
 * Falls back to SVG hand renderer (isl-hands.js) for words without a GIF.
 */

import { getISLSvgUrl } from './isl-hands.js';

const LETTERS_PATH = '/isl_gestures/letters/';
const WORDS_PATH   = '/isl_gestures/words/';

// ── Alphabet fingerspelling — real photos ─────────────────────────────────
// Maps each letter to its local JPG path
export const LETTER_PATHS = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(ch => {
  LETTER_PATHS[ch.toUpperCase()] = `${LETTERS_PATH}${ch}.jpg`;
});

// ── Word GIFs available locally (downloaded from satyam9090 repo) ─────────
// Keyed by the single ISL gloss word they best represent
export const WORD_GIFS = {
  'HELLO':      'hello.gif',
  'HI':         'hello.gif',
  'GOOD':       'good morning.gif',
  'MORNING':    'good morning.gif',
  'AFTERNOON':  'good afternoon.gif',
  'QUESTION':   'good question.gif',
  'SIT':        'sit down.gif',
  'STAND':      'stand up.gif',
  'FINE':       'i am fine.gif',
  'SORRY':      'i am sorry.gif',
  'THINK':      'i am thinking.gif',
  'TIRED':      'i am tired.gif',
  'HELP':       'shall I help you.gif',
  'MEET':       'nice to meet you.gif',
  'WORRY':      'dont worry.gif',
  'NAME':       'what is your name.gif',
  'PROBLEM':    'what is the problem.gif',
  'OPEN':       'open the door.gif',
  'WRONG':      'you are wrong.gif',
  'SIGN':       'sign language interpreter.gif',
  'HOMEWORK':   'did you finish homework.gif',
  'LUNCH':      'lets go for lunch.gif',
  'CAREFUL':    'be careful.gif',
  'CARE':       'take care.gif',
  'WHATSUP':    'whats up.gif',
};

// ── All known gloss words (SVG fallback for non-GIF words) ────────────────
export const KNOWN_WORDS = new Set([
  // Greetings
  'hello','bye','goodbye','good','morning','afternoon','evening','night',
  'please','thankyou','thank','sorry','welcome','yes','no','okay','ok','help','stop',
  // People
  'teacher','student','students','person','boy','girl','man','woman',
  'mother','father','friend','family','doctor',
  // Education verbs
  'read','reading','reads','write','writing','writes','learn','learning',
  'study','studying','understand','understood','know','think','answer',
  'question','ask','tell','explain','listen','see','look','remember',
  'forget','repeat','correct','wrong','complete','finish',
  // Objects
  'book','books','pen','pencil','paper','class','school','college',
  'exam','test','homework','board','table','chair','bag','computer',
  'phone','water','food',
  // Numbers (text)
  'one','two','three','four','five',
  // Adjectives & concepts
  'big','small','new','old','fast','slow','open','close','home','name',
  'time','today','tomorrow','yesterday','now','again','more','less',
  'same','different','important','difficult','easy','india','language',
  'sign','deaf','hear','speak','work','play','eat','drink','go','come',
  'sit','stand','walk','run','give','take','want','like','love',
  'happy','sad','angry','afraid',
]);

// ── Hindi → English word map for classroom speech ─────────────────────────
export const HINDI_TO_ENGLISH = {
  // People
  'शिक्षक': 'teacher',  'अध्यापक': 'teacher',  'मास्टर': 'teacher',
  'छात्र': 'student',   'विद्यार्थी': 'student', 'बच्चा': 'student',
  'बच्चे': 'students',  'लड़का': 'boy',         'लड़की': 'girl',
  'आदमी': 'man',        'महिला': 'woman',       'माँ': 'mother',
  'पिता': 'father',     'दोस्त': 'friend',      'डॉक्टर': 'doctor',
  // Education
  'किताब': 'book',      'पुस्तक': 'book',       'किताबें': 'books',
  'पढ़ना': 'read',       'पढ़ता': 'reads',       'पढ़ती': 'reads',
  'पढ़ो': 'read',        'लिखना': 'write',       'लिखता': 'writes',
  'सीखना': 'learn',     'सीखो': 'learn',        'समझना': 'understand',
  'समझो': 'understand', 'जानना': 'know',        'जानो': 'know',
  'याद': 'remember',    'सोचना': 'think',       'सोचो': 'think',
  'सवाल': 'question',   'जवाब': 'answer',       'उत्तर': 'answer',
  'स्कूल': 'school',    'कक्षा': 'class',       'परीक्षा': 'exam',
  'होमवर्क': 'homework', 'बोर्ड': 'board',       'कॉलेज': 'college',
  'कलम': 'pen',         'पेंसिल': 'pencil',     'कागज': 'paper',
  'बस्ता': 'bag',       'कंप्यूटर': 'computer',  'फोन': 'phone',
  // Greetings & common
  'नमस्ते': 'hello',    'नमस्कार': 'hello',     'अलविदा': 'goodbye',
  'धन्यवाद': 'thankyou','शुक्रिया': 'thankyou', 'माफ करना': 'sorry',
  'माफ': 'sorry',       'हाँ': 'yes',           'नहीं': 'no',
  'ठीक है': 'okay',     'ठीक': 'okay',          'मदद': 'help',
  'रुको': 'stop',       'रुकिए': 'stop',        'अच्छा': 'good',
  'बुरा': 'wrong',      'सही': 'correct',       'गलत': 'wrong',
  // Actions & adjectives
  'जाओ': 'go',          'आओ': 'come',           'बैठो': 'sit',
  'खड़े': 'stand',      'चलो': 'walk',          'दो': 'give',
  'लो': 'take',         'चाहिए': 'want',        'खाना': 'food',
  'पानी': 'water',      'घर': 'home',           'नाम': 'name',
  'समय': 'time',        'आज': 'today',          'कल': 'tomorrow',
  'कल था': 'yesterday', 'अभी': 'now',           'फिर': 'again',
  'बड़ा': 'big',        'छोटा': 'small',        'नया': 'new',
  'पुराना': 'old',      'तेज़': 'fast',         'धीमा': 'slow',
  'खुश': 'happy',       'दुखी': 'sad',          'खोलो': 'open',
  'बंद करो': 'close',   'महत्वपूर्ण': 'important','मुश्किल': 'difficult',
  'आसान': 'easy',       'प्यार': 'love',        'पसंद': 'like',
  'भारत': 'india',      'भाषा': 'language',     'काम': 'work',
};

/**
 * Look up a word. Priority:
 *  1. Real animated GIF from ISL_Gifs (type: 'gif')
 *  2. SVG hand illustration (type: 'word')
 *  Returns null if unknown → caller will fingerspell.
 */
export function lookupWord(word) {
  const key = word.toUpperCase();

  // 1. Check for a real GIF
  const gifFile = WORD_GIFS[key];
  if (gifFile) {
    return { url: `${WORDS_PATH}${gifFile}`, type: 'gif', label: key };
  }

  // 2. SVG fallback for known gloss words
  if (KNOWN_WORDS.has(key.toLowerCase())) {
    return { url: getISLSvgUrl(key, 'word'), type: 'word', label: key };
  }

  return null;
}

/**
 * Get fingerspelling sequence using real hand photos.
 */
export function fingerspell(word) {
  return word.toUpperCase().split('').map(ch => {
    if (!/[A-Z]/.test(ch)) return null;
    const path = LETTER_PATHS[ch];
    return path
      ? { url: path, type: 'letter', label: ch }
      : null;
  }).filter(Boolean);
}
