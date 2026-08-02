/**
 * isl-dict.js — Bharat Shakti ISL Gesture Dictionary
 *
 * Image sources (open-source, referenced in master document):
 *  - satyam9090/Automatic-Indian-Sign-Language-Translator (word GIFs)
 *  - AI4Bharat/INCLUDE (alphabet stills)
 *
 * Each entry: { url: string, type: 'word' | 'letter', label: string }
 */

const ISL_BASE = 'https://raw.githubusercontent.com/satyam9090/Automatic-Indian-Sign-Language-Translator/master/ISL_Gesture_Images/';

// ── Alphabet (A–Z) fallback for fingerspelling ─────────────────────────────
export const ISL_ALPHA = {};
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(ch => {
  ISL_ALPHA[ch] = {
    url: `${ISL_BASE}${ch}.jpg`,
    type: 'letter',
    label: ch
  };
});

// ── Word-level ISL gesture dictionary ─────────────────────────────────────
// Classroom-focused: covers teacher speech patterns in lectures
export const ISL_WORDS = {
  // Greetings & Basics
  'hello':        { url: `${ISL_BASE}hello.gif`,        type: 'word' },
  'bye':          { url: `${ISL_BASE}bye.gif`,           type: 'word' },
  'goodbye':      { url: `${ISL_BASE}bye.gif`,           type: 'word' },
  'good':         { url: `${ISL_BASE}good.gif`,          type: 'word' },
  'morning':      { url: `${ISL_BASE}morning.gif`,       type: 'word' },
  'afternoon':    { url: `${ISL_BASE}afternoon.gif`,     type: 'word' },
  'evening':      { url: `${ISL_BASE}evening.gif`,       type: 'word' },
  'night':        { url: `${ISL_BASE}night.gif`,         type: 'word' },
  'please':       { url: `${ISL_BASE}please.gif`,        type: 'word' },
  'thankyou':     { url: `${ISL_BASE}thankyou.gif`,      type: 'word' },
  'thank':        { url: `${ISL_BASE}thankyou.gif`,      type: 'word' },
  'sorry':        { url: `${ISL_BASE}sorry.gif`,         type: 'word' },
  'welcome':      { url: `${ISL_BASE}welcome.gif`,       type: 'word' },
  'yes':          { url: `${ISL_BASE}yes.gif`,           type: 'word' },
  'no':           { url: `${ISL_BASE}no.gif`,            type: 'word' },
  'okay':         { url: `${ISL_BASE}okay.gif`,          type: 'word' },
  'ok':           { url: `${ISL_BASE}okay.gif`,          type: 'word' },
  'help':         { url: `${ISL_BASE}help.gif`,          type: 'word' },
  'stop':         { url: `${ISL_BASE}stop.gif`,          type: 'word' },

  // People (classroom)
  'teacher':      { url: `${ISL_BASE}teacher.gif`,       type: 'word' },
  'student':      { url: `${ISL_BASE}student.gif`,       type: 'word' },
  'students':     { url: `${ISL_BASE}student.gif`,       type: 'word' },
  'person':       { url: `${ISL_BASE}person.gif`,        type: 'word' },
  'boy':          { url: `${ISL_BASE}boy.gif`,           type: 'word' },
  'girl':         { url: `${ISL_BASE}girl.gif`,          type: 'word' },
  'man':          { url: `${ISL_BASE}man.gif`,           type: 'word' },
  'woman':        { url: `${ISL_BASE}woman.gif`,         type: 'word' },
  'mother':       { url: `${ISL_BASE}mother.gif`,        type: 'word' },
  'father':       { url: `${ISL_BASE}father.gif`,        type: 'word' },
  'friend':       { url: `${ISL_BASE}friend.gif`,        type: 'word' },
  'family':       { url: `${ISL_BASE}family.gif`,        type: 'word' },
  'doctor':       { url: `${ISL_BASE}doctor.gif`,        type: 'word' },

  // Education verbs & nouns
  'read':         { url: `${ISL_BASE}read.gif`,          type: 'word' },
  'reading':      { url: `${ISL_BASE}read.gif`,          type: 'word' },
  'reads':        { url: `${ISL_BASE}read.gif`,          type: 'word' },
  'write':        { url: `${ISL_BASE}write.gif`,         type: 'word' },
  'writing':      { url: `${ISL_BASE}write.gif`,         type: 'word' },
  'writes':       { url: `${ISL_BASE}write.gif`,         type: 'word' },
  'learn':        { url: `${ISL_BASE}learn.gif`,         type: 'word' },
  'learning':     { url: `${ISL_BASE}learn.gif`,         type: 'word' },
  'study':        { url: `${ISL_BASE}study.gif`,         type: 'word' },
  'studying':     { url: `${ISL_BASE}study.gif`,         type: 'word' },
  'understand':   { url: `${ISL_BASE}understand.gif`,    type: 'word' },
  'understood':   { url: `${ISL_BASE}understand.gif`,    type: 'word' },
  'know':         { url: `${ISL_BASE}know.gif`,          type: 'word' },
  'think':        { url: `${ISL_BASE}think.gif`,         type: 'word' },
  'answer':       { url: `${ISL_BASE}answer.gif`,        type: 'word' },
  'question':     { url: `${ISL_BASE}question.gif`,      type: 'word' },
  'ask':          { url: `${ISL_BASE}ask.gif`,           type: 'word' },
  'tell':         { url: `${ISL_BASE}tell.gif`,          type: 'word' },
  'explain':      { url: `${ISL_BASE}tell.gif`,          type: 'word' },
  'listen':       { url: `${ISL_BASE}listen.gif`,        type: 'word' },
  'see':          { url: `${ISL_BASE}see.gif`,           type: 'word' },
  'look':         { url: `${ISL_BASE}see.gif`,           type: 'word' },
  'remember':     { url: `${ISL_BASE}remember.gif`,      type: 'word' },
  'forget':       { url: `${ISL_BASE}forget.gif`,        type: 'word' },
  'repeat':       { url: `${ISL_BASE}repeat.gif`,        type: 'word' },
  'correct':      { url: `${ISL_BASE}correct.gif`,       type: 'word' },
  'wrong':        { url: `${ISL_BASE}wrong.gif`,         type: 'word' },
  'complete':     { url: `${ISL_BASE}complete.gif`,      type: 'word' },
  'finish':       { url: `${ISL_BASE}finish.gif`,        type: 'word' },

  // Objects (classroom)
  'book':         { url: `${ISL_BASE}book.gif`,          type: 'word' },
  'books':        { url: `${ISL_BASE}book.gif`,          type: 'word' },
  'pen':          { url: `${ISL_BASE}pen.gif`,           type: 'word' },
  'pencil':       { url: `${ISL_BASE}pencil.gif`,        type: 'word' },
  'paper':        { url: `${ISL_BASE}paper.gif`,         type: 'word' },
  'class':        { url: `${ISL_BASE}class.gif`,         type: 'word' },
  'school':       { url: `${ISL_BASE}school.gif`,        type: 'word' },
  'college':      { url: `${ISL_BASE}college.gif`,       type: 'word' },
  'exam':         { url: `${ISL_BASE}exam.gif`,          type: 'word' },
  'test':         { url: `${ISL_BASE}test.gif`,          type: 'word' },
  'homework':     { url: `${ISL_BASE}homework.gif`,      type: 'word' },
  'board':        { url: `${ISL_BASE}board.gif`,         type: 'word' },
  'table':        { url: `${ISL_BASE}table.gif`,         type: 'word' },
  'chair':        { url: `${ISL_BASE}chair.gif`,         type: 'word' },
  'bag':          { url: `${ISL_BASE}bag.gif`,           type: 'word' },
  'computer':     { url: `${ISL_BASE}computer.gif`,      type: 'word' },
  'phone':        { url: `${ISL_BASE}phone.gif`,         type: 'word' },
  'water':        { url: `${ISL_BASE}water.gif`,         type: 'word' },
  'food':         { url: `${ISL_BASE}food.gif`,          type: 'word' },

  // Numbers (text form)
  'one':          { url: `${ISL_BASE}1.gif`,             type: 'word' },
  'two':          { url: `${ISL_BASE}2.gif`,             type: 'word' },
  'three':        { url: `${ISL_BASE}3.gif`,             type: 'word' },
  'four':         { url: `${ISL_BASE}4.gif`,             type: 'word' },
  'five':         { url: `${ISL_BASE}5.gif`,             type: 'word' },

  // Concepts & adjectives
  'big':          { url: `${ISL_BASE}big.gif`,           type: 'word' },
  'small':        { url: `${ISL_BASE}small.gif`,         type: 'word' },
  'new':          { url: `${ISL_BASE}new.gif`,           type: 'word' },
  'old':          { url: `${ISL_BASE}old.gif`,           type: 'word' },
  'fast':         { url: `${ISL_BASE}fast.gif`,          type: 'word' },
  'slow':         { url: `${ISL_BASE}slow.gif`,          type: 'word' },
  'open':         { url: `${ISL_BASE}open.gif`,          type: 'word' },
  'close':        { url: `${ISL_BASE}close.gif`,         type: 'word' },
  'home':         { url: `${ISL_BASE}home.gif`,          type: 'word' },
  'name':         { url: `${ISL_BASE}name.gif`,          type: 'word' },
  'time':         { url: `${ISL_BASE}time.gif`,          type: 'word' },
  'today':        { url: `${ISL_BASE}today.gif`,         type: 'word' },
  'tomorrow':     { url: `${ISL_BASE}tomorrow.gif`,      type: 'word' },
  'yesterday':    { url: `${ISL_BASE}yesterday.gif`,     type: 'word' },
  'now':          { url: `${ISL_BASE}now.gif`,           type: 'word' },
  'again':        { url: `${ISL_BASE}again.gif`,         type: 'word' },
  'more':         { url: `${ISL_BASE}more.gif`,          type: 'word' },
  'less':         { url: `${ISL_BASE}less.gif`,          type: 'word' },
  'same':         { url: `${ISL_BASE}same.gif`,          type: 'word' },
  'different':    { url: `${ISL_BASE}different.gif`,     type: 'word' },
  'important':    { url: `${ISL_BASE}important.gif`,     type: 'word' },
  'difficult':    { url: `${ISL_BASE}difficult.gif`,     type: 'word' },
  'easy':         { url: `${ISL_BASE}easy.gif`,          type: 'word' },
  'india':        { url: `${ISL_BASE}india.gif`,         type: 'word' },
  'language':     { url: `${ISL_BASE}language.gif`,      type: 'word' },
  'sign':         { url: `${ISL_BASE}sign.gif`,          type: 'word' },
  'deaf':         { url: `${ISL_BASE}deaf.gif`,          type: 'word' },
  'hear':         { url: `${ISL_BASE}hear.gif`,          type: 'word' },
  'speak':        { url: `${ISL_BASE}speak.gif`,         type: 'word' },
  'work':         { url: `${ISL_BASE}work.gif`,          type: 'word' },
  'play':         { url: `${ISL_BASE}play.gif`,          type: 'word' },
  'eat':          { url: `${ISL_BASE}eat.gif`,           type: 'word' },
  'drink':        { url: `${ISL_BASE}drink.gif`,         type: 'word' },
  'go':           { url: `${ISL_BASE}go.gif`,            type: 'word' },
  'come':         { url: `${ISL_BASE}come.gif`,          type: 'word' },
  'sit':          { url: `${ISL_BASE}sit.gif`,           type: 'word' },
  'stand':        { url: `${ISL_BASE}stand.gif`,         type: 'word' },
  'walk':         { url: `${ISL_BASE}walk.gif`,          type: 'word' },
  'run':          { url: `${ISL_BASE}run.gif`,           type: 'word' },
  'give':         { url: `${ISL_BASE}give.gif`,          type: 'word' },
  'take':         { url: `${ISL_BASE}take.gif`,          type: 'word' },
  'want':         { url: `${ISL_BASE}want.gif`,          type: 'word' },
  'like':         { url: `${ISL_BASE}like.gif`,          type: 'word' },
  'love':         { url: `${ISL_BASE}love.gif`,          type: 'word' },
  'happy':        { url: `${ISL_BASE}happy.gif`,         type: 'word' },
  'sad':          { url: `${ISL_BASE}sad.gif`,           type: 'word' },
  'angry':        { url: `${ISL_BASE}angry.gif`,         type: 'word' },
  'afraid':       { url: `${ISL_BASE}afraid.gif`,        type: 'word' },
};

// ── Hindi → English word map for common classroom speech ──────────────────
// Inspired by satyam9090 NLP pipeline approach
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
 * Look up a word in the ISL dictionary.
 * Returns gesture entry or null (caller should fingerspell).
 * @param {string} word — normalised, lowercase English word
 * @returns {{ url: string, type: string, label: string } | null}
 */
export function lookupWord(word) {
  const entry = ISL_WORDS[word.toLowerCase()];
  if (entry) return { ...entry, label: word.toUpperCase() };
  return null;
}

/**
 * Get fingerspelling sequence for a word.
 * @param {string} word
 * @returns {Array<{ url: string, type: string, label: string }>}
 */
export function fingerspell(word) {
  return word.toUpperCase().split('').map(ch => {
    const alpha = ISL_ALPHA[ch];
    return alpha
      ? { ...alpha, label: ch }
      : { url: '', type: 'letter', label: ch }; // space or punctuation
  });
}
