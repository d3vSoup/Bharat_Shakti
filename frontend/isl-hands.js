/**
 * isl-hands.js — ISL Hand Pose SVG Renderer
 *
 * Draws authentic ISL/ASL-inspired hand gesture illustrations
 * using pure SVG — no external image dependencies, works offline,
 * renders in <5ms, zero network latency.
 *
 * Each gesture is a parameterised SVG with:
 *   - A stylised palm + wrist
 *   - Finger positions (extended/curled/bent) per-finger
 *   - Thumb position
 *   - Optional hand orientation & movement indicator
 */

// Skin tone and style constants
const SKIN     = '#F5CBA7';
const SKIN_D   = '#E8A87C';
const OUTLINE  = '#271900';
const NAIL     = '#FDEBD0';

/**
 * Build an SVG data URL for a given ISL gloss word or letter.
 * @param {string} word — uppercase gloss label
 * @param {string} type — 'letter' | 'word'
 * @returns {string} SVG data URL (data:image/svg+xml;base64,...)
 */
export function getISLSvgUrl(word, type = 'word') {
  const svg = buildISLSvg(word.toUpperCase(), type);
  // Encode as data URL
  const encoded = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${encoded}`;
}

/**
 * Core SVG builder — returns SVG string
 */
function buildISLSvg(label, type) {
  const pose = type === 'letter' ? getAlphabetPose(label) : getWordPose(label);
  return renderHandSvg(label, pose, type);
}

// ── Finger layout helpers ──────────────────────────────────────────────────
// Each finger: { bend: 0-1 (0=extended, 1=fully curled), spread: deg offset }
// Thumb: { angle: degrees, extended: bool }

function extendedHand() {
  return {
    fingers: [
      { id: 'index',  bend: 0,    spread: -8  },
      { id: 'middle', bend: 0,    spread: 0   },
      { id: 'ring',   bend: 0,    spread: 8   },
      { id: 'pinky',  bend: 0,    spread: 16  },
    ],
    thumb:  { angle: -55, extended: true },
    wristRotate: 0,
    label2: ''
  };
}

function closedFist() {
  return {
    fingers: [
      { id: 'index',  bend: 0.85, spread: -8  },
      { id: 'middle', bend: 0.9,  spread: 0   },
      { id: 'ring',   bend: 0.88, spread: 8   },
      { id: 'pinky',  bend: 0.82, spread: 16  },
    ],
    thumb:  { angle: -30, extended: false },
    wristRotate: 0,
    label2: ''
  };
}

function pointIndex() {
  return {
    fingers: [
      { id: 'index',  bend: 0,    spread: -4  },
      { id: 'middle', bend: 0.85, spread: 0   },
      { id: 'ring',   bend: 0.88, spread: 8   },
      { id: 'pinky',  bend: 0.82, spread: 16  },
    ],
    thumb:  { angle: -20, extended: false },
    wristRotate: 0,
    label2: ''
  };
}

function vSign() {
  return {
    fingers: [
      { id: 'index',  bend: 0,    spread: -10 },
      { id: 'middle', bend: 0,    spread: 10  },
      { id: 'ring',   bend: 0.88, spread: 8   },
      { id: 'pinky',  bend: 0.82, spread: 16  },
    ],
    thumb:  { angle: -25, extended: false },
    wristRotate: 0,
    label2: ''
  };
}

function threeFingers() {
  return {
    fingers: [
      { id: 'index',  bend: 0,    spread: -8  },
      { id: 'middle', bend: 0,    spread: 0   },
      { id: 'ring',   bend: 0,    spread: 8   },
      { id: 'pinky',  bend: 0.82, spread: 16  },
    ],
    thumb:  { angle: -35, extended: false },
    wristRotate: 0,
    label2: ''
  };
}

function fourFingers() {
  return {
    fingers: [
      { id: 'index',  bend: 0,    spread: -8  },
      { id: 'middle', bend: 0,    spread: 0   },
      { id: 'ring',   bend: 0,    spread: 8   },
      { id: 'pinky',  bend: 0,    spread: 16  },
    ],
    thumb:  { angle: -35, extended: false },
    wristRotate: 0,
    label2: ''
  };
}

function okSign() {
  return {
    fingers: [
      { id: 'index',  bend: 0.5,  spread: -4  },
      { id: 'middle', bend: 0,    spread: 2   },
      { id: 'ring',   bend: 0,    spread: 10  },
      { id: 'pinky',  bend: 0,    spread: 18  },
    ],
    thumb:  { angle: -40, extended: true },
    wristRotate: 0,
    label2: 'O-shape'
  };
}

function pinchSign() {
  return {
    fingers: [
      { id: 'index',  bend: 0.6,  spread: -4  },
      { id: 'middle', bend: 0.8,  spread: 0   },
      { id: 'ring',   bend: 0.85, spread: 8   },
      { id: 'pinky',  bend: 0.8,  spread: 16  },
    ],
    thumb:  { angle: -45, extended: true },
    wristRotate: 0,
    label2: 'Pinch'
  };
}

function thumbsUp() {
  return {
    fingers: [
      { id: 'index',  bend: 0.85, spread: -8  },
      { id: 'middle', bend: 0.9,  spread: 0   },
      { id: 'ring',   bend: 0.88, spread: 8   },
      { id: 'pinky',  bend: 0.82, spread: 16  },
    ],
    thumb:  { angle: -90, extended: true },
    wristRotate: 0,
    label2: '👍'
  };
}

function waveHand() {
  return {
    fingers: [
      { id: 'index',  bend: 0,    spread: -8  },
      { id: 'middle', bend: 0,    spread: 0   },
      { id: 'ring',   bend: 0,    spread: 8   },
      { id: 'pinky',  bend: 0,    spread: 16  },
    ],
    thumb:  { angle: -55, extended: true },
    wristRotate: 15,
    label2: 'Wave'
  };
}

function curlAllButPinky() {
  return {
    fingers: [
      { id: 'index',  bend: 0.85, spread: -8  },
      { id: 'middle', bend: 0.9,  spread: 0   },
      { id: 'ring',   bend: 0.88, spread: 8   },
      { id: 'pinky',  bend: 0,    spread: 16  },
    ],
    thumb:  { angle: -30, extended: false },
    wristRotate: 0,
    label2: ''
  };
}

function hornsSign() {
  return {
    fingers: [
      { id: 'index',  bend: 0,    spread: -10 },
      { id: 'middle', bend: 0.85, spread: 0   },
      { id: 'ring',   bend: 0.88, spread: 8   },
      { id: 'pinky',  bend: 0,    spread: 16  },
    ],
    thumb:  { angle: -55, extended: true },
    wristRotate: 0,
    label2: ''
  };
}

// ── Alphabet Poses ─────────────────────────────────────────────────────────
function getAlphabetPose(letter) {
  const map = {
    'A': closedFist(),
    'B': fourFingers(),
    'C': { ...extendedHand(), fingers: extendedHand().fingers.map(f => ({ ...f, bend: 0.35 })), label2: 'C-curve' },
    'D': { ...pointIndex(), label2: 'D-shape' },
    'E': { ...closedFist(), fingers: closedFist().fingers.map(f => ({ ...f, bend: 0.6 })), label2: 'E-curl' },
    'F': { ...okSign(), label2: 'F-shape' },
    'G': { ...pointIndex(), wristRotate: 90, label2: 'G-point' },
    'H': { ...vSign(), wristRotate: 90, label2: 'H-pair' },
    'I': curlAllButPinky(),
    'J': { ...curlAllButPinky(), label2: 'J-hook' },
    'K': { ...vSign(), thumb: { angle: -45, extended: true }, label2: 'K-shape' },
    'L': { ...pointIndex(), thumb: { angle: -90, extended: true }, label2: 'L-shape' },
    'M': { ...closedFist(), fingers: [{ id: 'index', bend: 0.7, spread: -8 }, { id: 'middle', bend: 0.7, spread: 0 }, { id: 'ring', bend: 0.7, spread: 8 }, { id: 'pinky', bend: 0.88, spread: 16 }], label2: '3-over' },
    'N': { ...closedFist(), fingers: [{ id: 'index', bend: 0.7, spread: -8 }, { id: 'middle', bend: 0.7, spread: 0 }, { id: 'ring', bend: 0.88, spread: 8 }, { id: 'pinky', bend: 0.88, spread: 16 }], label2: '2-over' },
    'O': okSign(),
    'P': { ...pointIndex(), wristRotate: -45, label2: 'P-down' },
    'Q': { ...okSign(), wristRotate: -30, label2: 'Q-down' },
    'R': { ...vSign(), fingers: [{ id: 'index', bend: 0, spread: -3 }, { id: 'middle', bend: 0, spread: 3 }, { id: 'ring', bend: 0.88, spread: 8 }, { id: 'pinky', bend: 0.82, spread: 16 }], label2: 'Crossed' },
    'S': closedFist(),
    'T': { ...closedFist(), thumb: { angle: -30, extended: true }, label2: 'T-thumb' },
    'U': { ...vSign(), label2: 'U-together' },
    'V': vSign(),
    'W': threeFingers(),
    'X': { ...pointIndex(), fingers: [{ id: 'index', bend: 0.4, spread: -4 }, { id: 'middle', bend: 0.85, spread: 0 }, { id: 'ring', bend: 0.88, spread: 8 }, { id: 'pinky', bend: 0.82, spread: 16 }], label2: 'Hook' },
    'Y': { ...hornsSign(), label2: 'Y-hang' },
    'Z': { ...pointIndex(), wristRotate: 20, label2: 'Z-draw' },
  };
  return map[letter] || extendedHand();
}

// ── Word Poses ─────────────────────────────────────────────────────────────
function getWordPose(word) {
  const map = {
    // Greetings
    'HELLO':      waveHand(),
    'BYE':        waveHand(),
    'GOODBYE':    waveHand(),
    'WELCOME':    { ...extendedHand(), label2: 'Open arms' },
    'PLEASE':     { ...closedFist(), wristRotate: 10, label2: 'Circle chest' },
    'THANKYOU':   { ...extendedHand(), wristRotate: -20, label2: 'Chin→out' },
    'THANK':      { ...extendedHand(), wristRotate: -20, label2: 'Chin→out' },
    'SORRY':      { ...closedFist(), wristRotate: 15, label2: 'Circle chest' },
    'GOOD':       thumbsUp(),
    'YES':        closedFist(),
    'NO':         { ...vSign(), label2: 'Snap close' },
    'OKAY':       okSign(),
    'HELP':       { ...thumbsUp(), label2: 'Lift palm' },
    'STOP':       { ...extendedHand(), wristRotate: 0, label2: 'Flat stop' },
    // People
    'TEACHER':    { ...fourFingers(), label2: 'Spread→pull' },
    'STUDENT':    { ...extendedHand(), wristRotate: -10, label2: 'Open book' },
    'STUDENTS':   { ...extendedHand(), wristRotate: -10, label2: 'Open book' },
    'PERSON':     { ...vSign(), wristRotate: -10, label2: 'Move down' },
    'BOY':        { ...pointIndex(), thumb: { angle: -55, extended: true }, label2: 'Hat brim' },
    'GIRL':       { ...okSign(), label2: 'Cheek trace' },
    'MOTHER':     { ...extendedHand(), thumb: { angle: -40, extended: true }, label2: 'Touch chin' },
    'FATHER':     { ...extendedHand(), thumb: { angle: -40, extended: true }, label2: 'Touch fore' },
    'FRIEND':     { ...vSign(), label2: 'Hook&swap' },
    'DOCTOR':     { ...okSign(), label2: 'Wrist tap' },
    // Education
    'READ':       { ...vSign(), wristRotate: -30, label2: 'Eyes→book' },
    'READING':    { ...vSign(), wristRotate: -30, label2: 'Eyes→book' },
    'READS':      { ...vSign(), wristRotate: -30, label2: 'Eyes→book' },
    'WRITE':      { ...pinchSign(), label2: 'Write motion' },
    'WRITING':    { ...pinchSign(), label2: 'Write motion' },
    'LEARN':      { ...extendedHand(), label2: 'Head→flat' },
    'LEARNING':   { ...extendedHand(), label2: 'Head→flat' },
    'STUDY':      { ...vSign(), label2: 'Point eyes' },
    'UNDERSTAND': { ...pointIndex(), wristRotate: 20, label2: 'Temple snap' },
    'KNOW':       { ...extendedHand(), wristRotate: -15, label2: 'Temple tap' },
    'THINK':      { ...pointIndex(), label2: 'Temple point' },
    'ANSWER':     { ...vSign(), label2: 'Down→out' },
    'QUESTION':   { ...pointIndex(), wristRotate: 30, label2: 'Q-draw' },
    'ASK':        { ...pointIndex(), label2: 'Arc down' },
    'LISTEN':     { ...extendedHand(), label2: 'Ear cup' },
    'REMEMBER':   { ...thumbsUp(), label2: 'Temple→fist' },
    'REPEAT':     { ...closedFist(), wristRotate: 20, label2: 'Roll back' },
    'CORRECT':    { ...vSign(), wristRotate: -10, label2: 'V-confirm' },
    'WRONG':      closedFist(),
    // Objects
    'BOOK':       { ...extendedHand(), fingers: [{ id: 'index', bend: 0, spread: -8 }, { id: 'middle', bend: 0, spread: 0 }, { id: 'ring', bend: 0, spread: 8 }, { id: 'pinky', bend: 0, spread: 16 }], label2: 'Open&close' },
    'PEN':        { ...pinchSign(), label2: 'Write hold' },
    'PENCIL':     { ...pinchSign(), label2: 'Write hold' },
    'PAPER':      { ...extendedHand(), label2: 'Flat slide' },
    'SCHOOL':     { ...closedFist(), label2: 'Clap hands' },
    'CLASS':      { ...fourFingers(), wristRotate: -15, label2: 'C-shape' },
    'EXAM':       { ...vSign(), wristRotate: -20, label2: 'Paper-read' },
    'HOMEWORK':   { ...extendedHand(), wristRotate: 10, label2: 'Work sign' },
    'COMPUTER':   { ...closedFist(), label2: 'Type motion' },
    'WATER':      { ...threeFingers(), label2: 'W→chin' },
    'FOOD':       { ...closedFist(), wristRotate: -10, label2: 'Eat motion' },
    // Emotions
    'HAPPY':      { ...extendedHand(), wristRotate: -15, label2: 'Chest circle' },
    'SAD':        { ...closedFist(), wristRotate: -30, label2: 'Hands down' },
    'LOVE':       { ...closedFist(), label2: 'Cross chest' },
    'LIKE':       { ...extendedHand(), thumb: { angle: -50, extended: true }, label2: 'Pull from chest' },
    // Actions
    'COME':       { ...pointIndex(), wristRotate: -10, label2: 'Beckon' },
    'GO':         { ...pointIndex(), wristRotate: 10, label2: 'Point away' },
    'SIT':        { ...vSign(), wristRotate: -60, label2: 'Sit on' },
    'STAND':      { ...vSign(), label2: 'Upright V' },
    'WORK':       { ...closedFist(), wristRotate: 15, label2: 'Knuckle tap' },
    'PLAY':       { ...hornsSign(), label2: 'Shake Y' },
    'EAT':        { ...closedFist(), wristRotate: -15, label2: 'Mouth tap' },
    'DRINK':      { ...okSign(), wristRotate: -30, label2: 'Tilt back' },
  };
  // Fallback: use first letter's pose
  return map[word] || getAlphabetPose(word[0] || 'A');
}

// ── SVG Renderer ───────────────────────────────────────────────────────────
function renderHandSvg(label, pose, type) {
  const W = 280, H = 240;
  const cx = W / 2, palmY = 165, palmW = 80, palmH = 65;
  const fingerBaseY = palmY - palmH / 2 + 5;
  const fingerSpacing = 18;
  const fingerStartX = cx - fingerSpacing * 1.5;

  // Wrist
  const wristX = cx, wristY = palmY + palmH / 2;

  const rot = pose.wristRotate || 0;

  // Colour scheme by type
  const bgColor   = type === 'letter' ? '#1c1c18' : '#1c1c18';
  const accentCol = type === 'letter' ? '#ffb800' : '#bdd6ff';
  const textCol   = type === 'letter' ? '#ffb800' : '#bdd6ff';

  // Build fingers SVG
  let fingersSvg = '';
  const fingerDefs = [
    { label: 'index',  x: fingerStartX,                  len: 62 },
    { label: 'middle', x: fingerStartX + fingerSpacing,   len: 68 },
    { label: 'ring',   x: fingerStartX + fingerSpacing*2, len: 64 },
    { label: 'pinky',  x: fingerStartX + fingerSpacing*3, len: 50 },
  ];

  for (let i = 0; i < pose.fingers.length; i++) {
    const f = pose.fingers[i];
    const fd = fingerDefs[i];
    const bend = f.bend || 0;
    const fX = fd.x;
    const fLen = fd.len;
    const spread = (f.spread || 0) * 0.3;

    // Tip position based on bend
    const tipY = fingerBaseY - fLen * (1 - bend * 0.85);
    const tipX = fX + spread + bend * (cx - fX) * 0.3;

    // Control point for curve
    const cp1X = fX + spread * 0.3;
    const cp1Y = fingerBaseY - fLen * 0.6 * (1 - bend * 0.4);
    const cp2X = tipX;
    const cp2Y = tipY + fLen * 0.25 * (1 - bend);

    fingersSvg += `
      <path d="M ${fX} ${fingerBaseY}
               C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${tipX} ${tipY}
               C ${tipX+5} ${tipY-4} ${tipX+8} ${tipY+5} ${tipX+5} ${fingerBaseY+2}
               Z"
            fill="${SKIN}" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="${tipX-1}" y="${tipY-2}" width="7" height="6" rx="3"
            fill="${NAIL}" stroke="${OUTLINE}" stroke-width="0.8" opacity="${bend < 0.3 ? 1 : 0}"/>
    `;
  }

  // Thumb
  const thumb = pose.thumb || { angle: -55, extended: true };
  const tAngle = (thumb.angle * Math.PI) / 180;
  const tLen = thumb.extended ? 45 : 28;
  const tBaseX = cx - palmW / 2 - 2;
  const tBaseY = palmY;
  const tTipX = tBaseX + Math.cos(tAngle) * tLen;
  const tTipY = tBaseY + Math.sin(tAngle) * tLen;

  const thumbSvg = `
    <path d="M ${tBaseX} ${tBaseY}
             C ${tBaseX - 10} ${tBaseY - 15} ${tTipX - 5} ${tTipY + 5} ${tTipX} ${tTipY}
             C ${tTipX + 6} ${tTipY - 4} ${tTipX + 8} ${tBaseY + 4} ${tBaseX + 6} ${tBaseY + 4}
             Z"
          fill="${SKIN}" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>
  `;

  // Palm
  const palmSvg = `
    <rect x="${cx - palmW / 2}" y="${palmY - palmH / 2}" width="${palmW}" height="${palmH}"
          rx="10" ry="10"
          fill="${SKIN}" stroke="${OUTLINE}" stroke-width="1.5"/>
    <!-- Palm crease lines -->
    <path d="M ${cx - palmW/2 + 12} ${palmY - 5} Q ${cx} ${palmY - 10} ${cx + palmW/2 - 12} ${palmY - 5}"
          fill="none" stroke="${SKIN_D}" stroke-width="1" opacity="0.6"/>
    <path d="M ${cx - palmW/2 + 8} ${palmY + 10} Q ${cx} ${palmY + 5} ${cx + palmW/2 - 8} ${palmY + 10}"
          fill="none" stroke="${SKIN_D}" stroke-width="1" opacity="0.6"/>
  `;

  // Wrist
  const wristSvg = `
    <rect x="${cx - 22}" y="${wristY - 4}" width="44" height="22" rx="8"
          fill="${SKIN}" stroke="${OUTLINE}" stroke-width="1.5"/>
  `;

  // Movement/direction indicator
  const label2 = pose.label2 || '';
  const indicatorSvg = label2 ? `
    <text x="${W / 2}" y="${H - 12}" text-anchor="middle"
          font-family="'Atkinson Hyperlegible Next', sans-serif"
          font-size="10" font-weight="600" fill="${accentCol}" opacity="0.75">${label2}</text>
  ` : '';

  // For letters: large centered letter + tiny badge top-right
  // For words: compact label banner at very top
  const isLetter = type === 'letter';
  const labelFontSize = isLetter ? 80 : (label.length > 8 ? 13 : label.length > 5 ? 17 : 22);
  const labelY = isLetter ? 62 : 24;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="${accentCol}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${bgColor}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="${accentCol}" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${bgColor}" rx="8"/>
  <rect width="${W}" height="${H}" fill="url(#glow)" rx="8"/>

  <!-- Hand group with wrist rotation -->
  <g transform="rotate(${rot}, ${cx}, ${palmY})" filter="url(#shadow)">
    ${wristSvg}
    ${palmSvg}
    ${thumbSvg}
    ${fingersSvg}
  </g>

  <!-- Label -->
  ${isLetter ? `
  <!-- Big letter — top-left area, away from the hand -->
  <text x="${W/2}" y="${labelY}" text-anchor="middle"
        font-family="'Atkinson Hyperlegible Next', Arial, sans-serif"
        font-size="${labelFontSize}" font-weight="900"
        fill="${textCol}" opacity="0.22">${label}</text>
  ` : `
  <text x="${W/2}" y="${labelY}" text-anchor="middle"
        font-family="'Atkinson Hyperlegible Next', Arial, sans-serif"
        font-size="${labelFontSize}" font-weight="800"
        fill="${textCol}">${label}</text>
  `}

  <!-- Type badge — TOP-RIGHT corner, never overlapping the hand -->
  ${isLetter ? `
  <rect x="${W-82}" y="8" width="74" height="18" rx="9" fill="${accentCol}" opacity="0.18"/>
  <text x="${W-45}" y="20" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="8.5" font-weight="700"
        fill="${textCol}" letter-spacing="0.08em">✋ FINGERSPELL</text>
  ` : `
  <rect x="${W-54}" y="${H-26}" width="46" height="18" rx="9" fill="${accentCol}" opacity="0.15"/>
  <text x="${W-31}" y="${H-14}" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="8.5" font-weight="700"
        fill="${textCol}" letter-spacing="0.05em">ISL SIGN</text>
  `}

  ${indicatorSvg}
</svg>`;
}
