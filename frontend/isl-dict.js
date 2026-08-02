/**
 * isl-dict.js — Bharat Shakti ISL Gesture Dictionary
 *
 * Image sources (priority order):
 *  1. Animated GIFs  — satyam9090/Automatic-Indian-Sign-Language-Translator
 *     words/*.gif → animated ISL phrase GIFs
 *  2. Vivit still frames — Kaggle kaushikyh/indian-sign-language-words-with-landmarks
 *     words_vivit/*.jpg → landmark-overlaid ISL word frames (224×224, from MOV)
 *  3. SVG hand renderer (isl-hands.js) — zero-network fallback
 *
 * Fingerspelling: letters/*.jpg — real ISL hand photos (satyam9090, 1440×1080)
 */

import { getISLSvgUrl } from './isl-hands.js';

const LETTERS_PATH     = '/isl_gestures/letters/';
const WORDS_PATH       = '/isl_gestures/words/';
const WORDS_VIVIT_PATH = '/isl_gestures/words_vivit/';

// ── Alphabet fingerspelling — real photos ──────────────────────────────────
export const LETTER_PATHS = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(ch => {
  LETTER_PATHS[ch.toUpperCase()] = `${LETTERS_PATH}${ch}.jpg`;
});

// ── Word GIFs (animated, phrase-level) ────────────────────────────────────
export const WORD_GIFS = {
  'HELLO':      'hello.gif',
  'HI':         'hello.gif',
  'MORNING':    'good morning.gif',
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

// ── Vivit word still images (76 words, landmark-overlaid, 224×224) ─────────
// Extracted from ProcessedData_vivit .MOV files (Kaggle kaushikyh dataset)
export const WORD_STILLS = {
  'AFTERNOON':  'afternoon.jpg',
  'ANIMAL':     'animal.jpg',
  'BAD':        'bad.jpg',
  'BEAUTIFUL':  'beautiful.jpg',
  'BIG':        'big.jpg',
  'BIRD':       'bird.jpg',
  'BLIND':      'blind.jpg',
  'CAT':        'cat.jpg',
  'CHEAP':      'cheap.jpg',
  'CLOTHING':   'clothing.jpg',
  'COLD':       'cold.jpg',
  'COW':        'cow.jpg',
  'CURVED':     'curved.jpg',
  'DEAF':       'deaf.jpg',
  'DOG':        'dog.jpg',
  'DRESS':      'dress.jpg',
  'DRY':        'dry.jpg',
  'EVENING':    'evening.jpg',
  'EXPENSIVE':  'expensive.jpg',
  'FAMOUS':     'famous.jpg',
  'FAST':       'fast.jpg',
  'FEMALE':     'female.jpg',
  'FISH':       'fish.jpg',
  'FLAT':       'flat.jpg',
  'FRIDAY':     'friday.jpg',
  'GOOD':       'good.jpg',
  'HAPPY':      'happy.jpg',
  'HAT':        'hat.jpg',
  'HEALTHY':    'healthy.jpg',
  'HORSE':      'horse.jpg',
  'HOT':        'hot.jpg',
  'HOUR':       'hour.jpg',
  'LIGHT':      'light.jpg',
  'LONG':       'long.jpg',
  'LOOSE':      'loose.jpg',
  'LOUD':       'loud.jpg',
  'MINUTE':     'minute.jpg',
  'MONDAY':     'monday.jpg',
  'MONTH':      'month.jpg',
  'MORNING':    'morning.jpg',
  'MOUSE':      'mouse.jpg',
  'NARROW':     'narrow.jpg',
  'NEW':        'new.jpg',
  'NIGHT':      'night.jpg',
  'OLD':        'old.jpg',
  'PANT':       'pant.jpg',
  'POCKET':     'pocket.jpg',
  'QUIET':      'quiet.jpg',
  'SAD':        'sad.jpg',
  'SATURDAY':   'saturday.jpg',
  'SECOND':     'second.jpg',
  'SHIRT':      'shirt.jpg',
  'SHOES':      'shoes.jpg',
  'SHORT':      'short.jpg',
  'SICK':       'sick.jpg',
  'SKIRT':      'skirt.jpg',
  'SLOW':       'slow.jpg',
  'SMALL':      'small.jpg',
  'SUIT':       'suit.jpg',
  'SUNDAY':     'sunday.jpg',
  'T_SHIRT':    't_shirt.jpg',
  'TALL':       'tall.jpg',
  'THURSDAY':   'thursday.jpg',
  'TIME':       'time.jpg',
  'TODAY':      'today.jpg',
  'TOMORROW':   'tomorrow.jpg',
  'TUESDAY':    'tuesday.jpg',
  'UGLY':       'ugly.jpg',
  'WARM':       'warm.jpg',
  'WEDNESDAY':  'wednesday.jpg',
  'WEEK':       'week.jpg',
  'WET':        'wet.jpg',
  'WIDE':       'wide.jpg',
  'YEAR':       'year.jpg',
  'YESTERDAY':  'yesterday.jpg',
  'YOUNG':      'young.jpg',
};

// ── All known gloss words (SVG fallback for remaining words) ───────────────
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
  // Numbers
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
 *  1. Animated GIF (phrase-level, most expressive)
 *  2. Vivit still image (landmark-overlaid real ISL frame)
 *  3. SVG hand renderer (fallback for remaining known words)
 *  Returns null → caller will fingerspell letter by letter.
 */
export function lookupWord(word) {
  const key = word.toUpperCase();

  // 1. Animated GIF
  const gifFile = WORD_GIFS[key];
  if (gifFile) {
    return { url: `${WORDS_PATH}${gifFile}`, type: 'gif', label: key };
  }

  // 2. Vivit real landmark image
  const stillFile = WORD_STILLS[key];
  if (stillFile) {
    return { url: `${WORDS_VIVIT_PATH}${stillFile}`, type: 'still', label: key };
  }

  // 3. SVG hand illustration fallback
  if (KNOWN_WORDS.has(key.toLowerCase())) {
    return { url: getISLSvgUrl(key, 'word'), type: 'word', label: key };
  }

  return null;
}

/**
 * Fingerspelling — uses real ISL hand photos (1440×1080 JPGs).
 */
export function fingerspell(word) {
  return word.toUpperCase().split('').map(ch => {
    if (!/[A-Z]/.test(ch)) return null;
    const path = LETTER_PATHS[ch];
    return path ? { url: path, type: 'letter', label: ch } : null;
  }).filter(Boolean);
}
