// ============================================
// FIVE-BOX - Game Logic
// ============================================

// Word Lists (truncated for demo - would normally be much larger)
const ANSWER_LIST = [
  "about", "above", "acute", "admit", "adopt", "adult", "after", "again", "agent", "agree",
  "alarm", "album", "alert", "alike", "alive", "allow", "alone", "along", "alter", "among",
  "anger", "angle", "angry", "apart", "apple", "apply", "arena", "argue", "arise", "array",
  "arrow", "aside", "asset", "avoid", "award", "aware", "badly", "baker", "bases", "basic",
  "beach", "began", "begin", "being", "below", "bench", "birth", "black", "blade", "blame",
  "blank", "bless", "blind", "block", "blood", "board", "boost", "booth", "bound", "brain",
  "brand", "brave", "bread", "break", "breed", "brick", "brief", "bring", "broad", "broke",
  "brown", "brush", "build", "built", "buyer", "cable", "carry", "catch", "cause", "chain",
  "chair", "chaos", "charm", "chart", "chase", "cheap", "check", "chest", "chief", "child",
  "china", "chose", "civil", "claim", "class", "clean", "clear", "clerk", "click", "cliff",
  "climb", "clock", "close", "cloth", "cloud", "coach", "coast", "could", "count", "court",
  "cover", "crack", "craft", "crash", "crazy", "cream", "crime", "cross", "crowd", "crown",
  "crude", "curve", "cycle", "daily", "dance", "dealt", "death", "debut", "delay", "depth",
  "dirty", "doubt", "dozen", "draft", "drain", "drama", "drank", "drawn", "dream", "dress",
  "dried", "drink", "drive", "drove", "drunk", "early", "earth", "eight", "elite", "empty",
  "enemy", "enjoy", "enter", "entry", "equal", "error", "essay", "event", "every", "exact",
  "exist", "extra", "faith", "false", "fancy", "fatal", "fault", "favor", "fiber", "field",
  "fifth", "fifty", "fight", "final", "first", "fixed", "flame", "flash", "fleet", "flesh",
  "float", "floor", "flour", "fluid", "focus", "force", "forth", "forty", "forum", "found",
  "frame", "frank", "fraud", "fresh", "front", "frost", "fruit", "fully", "funny", "ghost",
  "giant", "given", "glass", "globe", "glory", "going", "grace", "grade", "grain", "grand",
  "grant", "grape", "graph", "grasp", "grass", "grave", "great", "green", "greet", "gross",
  "group", "grown", "guard", "guess", "guest", "guide", "guilt", "habit", "happy", "harsh",
  "heart", "heavy", "hello", "hence", "horse", "hotel", "house", "human", "humor", "hurry",
  "ideal", "image", "imply", "index", "inner", "input", "issue", "japan", "joint", "judge",
  "known", "label", "large", "laser", "later", "laugh", "layer", "learn", "lease", "least",
  "leave", "legal", "lemon", "level", "light", "limit", "liver", "local", "logic", "loose",
  "lover", "lower", "loyal", "lucky", "lunch", "magic", "major", "maker", "march", "marry",
  "match", "maybe", "mayor", "meant", "medal", "media", "melon", "mercy", "merit", "metal",
  "meter", "might", "minor", "minus", "mixed", "model", "money", "month", "moral", "motor",
  "mount", "mouse", "mouth", "moved", "movie", "music", "naked", "named", "nerve", "never",
  "night", "ninth", "noble", "noise", "north", "noted", "novel", "nurse", "occur", "ocean",
  "offer", "often", "olive", "orbit", "order", "organ", "other", "ought", "outer", "owned",
  "owner", "paint", "panel", "panic", "paper", "party", "patch", "pause", "peace", "phase",
  "phone", "photo", "piano", "piece", "pilot", "pitch", "pizza", "place", "plain", "plane",
  "plant", "plate", "plaza", "point", "pound", "power", "press", "price", "pride", "prime",
  "print", "prior", "prize", "probe", "prone", "proof", "proud", "prove", "queen", "query",
  "quest", "quick", "quiet", "quite", "quota", "quote", "radio", "raise", "rally", "ranch",
  "range", "rapid", "ratio", "reach", "react", "ready", "realm", "rebel", "refer", "reign",
  "relax", "reply", "rider", "ridge", "rifle", "right", "rigid", "rival", "river", "roast",
  "robot", "rocky", "roman", "rough", "round", "route", "royal", "rugby", "ruler", "rural",
  "sadly", "safer", "saint", "salad", "sales", "sandy", "sauce", "scale", "scare", "scene",
  "scope", "score", "scout", "screw", "seize", "sense", "serve", "setup", "seven", "shade",
  "shake", "shall", "shame", "shape", "share", "shark", "sharp", "sheep", "sheer", "sheet",
  "shelf", "shell", "shift", "shine", "shirt", "shock", "shoot", "shore", "short", "shout",
  "shown", "sight", "silly", "since", "sixth", "sixty", "skill", "sleep", "slice", "slide",
  "slope", "small", "smart", "smell", "smile", "smoke", "snake", "solar", "solid", "solve",
  "sorry", "sound", "south", "space", "spare", "spark", "speak", "speed", "spell", "spend",
  "spent", "spice", "spine", "spite", "split", "spoke", "spoon", "sport", "spray", "squad",
  "stack", "staff", "stage", "stain", "stake", "stamp", "stand", "start", "state", "steak",
  "steal", "steam", "steel", "steep", "steer", "stick", "still", "stock", "stone", "stood",
  "store", "storm", "story", "stove", "strap", "straw", "strip", "stuck", "study", "stuff",
  "style", "sugar", "suite", "sunny", "super", "surge", "swamp", "swear", "sweep", "sweet",
  "swift", "swing", "sword", "table", "taken", "taste", "taxes", "teach", "tempo", "tenth",
  "terms", "thank", "theft", "their", "theme", "there", "these", "thick", "thing", "think",
  "third", "those", "three", "threw", "throw", "thumb", "tiger", "tight", "timer", "title",
  "toast", "today", "token", "topic", "total", "touch", "tough", "tower", "toxic", "trace",
  "track", "trade", "trail", "train", "trait", "trash", "treat", "trend", "trial", "tribe",
  "trick", "tried", "tries", "troop", "truck", "truly", "trump", "trunk", "trust", "truth",
  "tulip", "tumor", "twice", "twist", "uncle", "under", "undue", "union", "unity", "until",
  "upper", "upset", "urban", "usage", "usual", "valid", "value", "vapor", "venue", "verse",
  "video", "virus", "visit", "vital", "vivid", "vocal", "voice", "voter", "wagon", "waist",
  "waste", "watch", "water", "waved", "weary", "weird", "whale", "wheat", "wheel", "where",
  "which", "while", "white", "whole", "whose", "wider", "width", "woman", "women", "world",
  "worry", "worse", "worst", "worth", "would", "wound", "wrath", "wrist", "write", "wrong",
  "wrote", "yacht", "yield", "young", "youth", "zones"
];

// Valid guesses include answer list plus many more obscure 5-letter words
const VALID_GUESSES = new Set([
  ...ANSWER_LIST,
  "aahed", "aalii", "abaca", "abaci", "aback", "abamp", "abase", "abash", "abate", "abaya",
  "abide", "abode", "aboon", "abort", "abuse", "abuts", "abysm", "acerb", "ached", "aches",
  "acids", "acing", "acned", "acnes", "acorn", "acres", "acrid", "acted", "actor", "addax",
  "added", "adder", "addle", "adeem", "adios", "adman", "admen", "adobe", "adobo", "adore",
  "adorn", "adult", "adzes", "aerie", "affix", "afire", "afoot", "afore", "afoul", "agers",
  "aggie", "agile", "aging", "agios", "aglow", "agone", "agora", "agues", "ahead", "aider",
  "aides", "ailed", "aimed", "aimer", "aioli", "aired", "airer", "aisle", "alamo", "alarm",
  "alary", "album", "alder", "aleph", "algae", "algal", "alias", "alibi", "alien", "align",
  "allay", "alley", "allot", "alloy", "aloes", "aloft", "aloha", "alpha", "altar", "alums",
  "amass", "amaze", "amber", "ambit", "amble", "ambos", "ameba", "amend", "amice", "amigo",
  "amine", "amino", "amiss", "amity", "ammos", "amnia", "amoks", "amole", "amort", "amour",
  "ample", "amply", "amuck", "amuse", "ancho", "anear", "angel", "anglo", "angst", "anima",
  "anime", "anion", "anise", "ankle", "annex", "annoy", "anode", "antic", "antis", "antsy",
  "anvil", "aorta", "apace", "aphid", "apnea", "aport", "appel", "apres", "apron", "apsis",
  "aptly", "aquae", "aquas", "arbor", "arced", "ardor", "areae", "areal", "areas", "areca",
  "arepa", "argon", "argot", "arias", "arils", "armed", "armor", "aroid", "aroma", "arose",
  "arras", "arris", "arson", "artsy", "arums", "asana", "ascot", "ashed", "ashen", "ashes",
  "askew", "aspen", "asper", "aspic", "assay", "asses", "atilt", "atlas", "atoll", "atoms",
  "atone", "atria", "attic", "audio", "audit", "auger", "aught", "augur", "aunts", "aunty",
  "aurae", "aural", "auras", "auric", "autos", "auxin", "avail", "avant", "avast", "avert",
  "avian", "avion", "aviso", "avows", "await", "awake", "awash", "awful", "awoke", "awols",
  "axels", "axial", "axils", "axing", "axiom", "axion", "axles", "axons", "azide", "azine",
  "azoic", "azole", "azote", "azoth", "azure", "babel", "babes", "babka", "backs", "bacon",
  "badge", "bagel", "baggy", "bails", "bairn", "baits", "baked", "bakes", "balds", "baldy",
  "baled", "baler", "bales", "balks", "balky", "balls", "balms", "balmy", "banal", "banco",
  "bands", "bandy", "banes", "bangs", "banjo", "banks", "barbs", "bards", "bared", "barer",
  "bares", "barge", "barks", "barky", "barns", "baron", "barre", "basal", "based", "baser",
  "basil", "basin", "basis", "basks", "bassi", "basso", "bassy", "baste", "batch", "bated",
  "bathe", "baths", "batik", "baton", "batts", "batty", "bauds", "bawds", "bawdy", "bawls",
  "bayed", "bayou", "beads", "beady", "beaks", "beaky", "beams", "beamy", "beans", "beard",
  "bears", "beast", "beats", "beaus", "beaut", "beaux", "bebop", "becks", "bedim", "beech",
  "beefs", "beefy", "beeps", "beers", "beery", "beets", "befit", "befog", "begat", "beget",
  "begot", "begun", "beige", "belay", "belch", "belie", "belle", "bells", "belly", "belts",
  "bench", "bends", "bendy", "beret", "bergs", "berry", "berth", "beryl", "beset", "bests",
  "betas", "bevel", "bezel", "bible", "bicep", "biddy", "bided", "bider", "bides", "bidet",
  "biggy", "bight", "bigot", "bijou", "biked", "biker", "bikes", "bilbo", "biles", "bilge",
  "bilks", "bills", "billy", "bimbo", "binds", "binge", "bingo", "biome", "biped", "birch",
  "birds", "birth", "bison", "biter", "bites", "bitsy", "bitty", "blabs", "blade", "blahs",
  "blare", "blase", "blast", "blaze", "bleak", "bleat", "bleed", "bleep", "blend", "blent",
  "blest", "blimp", "blink", "blips", "bliss", "blitz", "bloat", "blobs", "blocs", "blogs",
  "bloke", "blond", "blown", "blows", "blubs", "blued", "bluer", "blues", "bluff", "blunt",
  "blurb", "blurs", "blurt", "blush", "boars", "boats", "bobby", "boded", "bodes", "bogey",
  "bogie", "bogus", "boils", "bolas", "bolds", "boles", "bolls", "bolts", "bolus", "bombs",
  "bonds", "boned", "boner", "bones", "bongo", "bongs", "bonks", "bonus", "boobs", "booby",
  "booed", "books", "booms", "boons", "boors", "boots", "booty", "booze", "boozy", "borax",
  "bored", "borer", "bores", "borne", "boron", "bosks", "bosky", "bosom", "bossy", "botch",
  "bough", "boule", "bourg", "bourn", "bouts", "bowed", "bowel", "bower", "bowls", "boxed",
  "boxer", "boxes", "boyar", "boyos", "bozos", "brace", "bract", "brads", "brags", "braid",
  "brail", "brake", "brand", "brank", "brans", "brash", "brass", "brats", "brava", "bravo",
  "brawl", "brawn", "brays", "braze", "bread", "break", "bream", "breed", "brews", "briar",
  "bribe", "bricks", "bride", "brier", "bries", "brigs", "brims", "brine", "brink", "briny",
  "brisk", "brits", "broil", "broke", "brood", "brook", "broom", "broth", "brown", "brows",
  "brunt", "brute", "bubba", "bucks", "buddy", "budge", "buffs", "buggy", "bugle", "build",
  "built", "bulbs", "bulge", "bulks", "bulky", "bulls", "bully", "bumps", "bumpy", "bunch",
  "bunco", "bungs", "bunks", "bunny", "bunts", "buoys", "burbs", "buret", "burgh", "burgs",
  "burls", "burly", "burns", "burnt", "burps", "burro", "burrs", "bursa", "burst", "busby",
  "buses", "bushy", "busts", "busty", "butch", "butte", "butts", "buxom", "buyer", "buzzy",
  "bylaw", "byres", "bytes", "byway", "cabal", "cabby", "caber", "cabin", "cable", "cacao",
  "cache", "cacti", "caddy", "cades", "cadet", "cadge", "cadre", "cafes", "caged", "cager",
  "cages", "cagey", "cairn", "cajon", "caked", "cakes", "calfs", "calif", "calks", "calla",
  "calls", "calms", "calve", "calyx", "camel", "cameo", "cames", "campi", "campo", "camps",
  "campy", "canal", "candy", "caned", "caner", "canes", "canid", "canna", "canny", "canoe",
  "canon", "canst", "canto", "cants", "caped", "caper", "capes", "capon", "capos", "caput",
  "carat", "carbs", "cards", "cared", "carer", "cares", "caret", "cargo", "carks", "carls",
  "carol", "carom", "carps", "carry", "carse", "carte", "carts", "carve", "cased", "cases",
  "casks", "caste", "casts", "catch", "cater", "caulk", "cauls", "cause", "caved", "caver",
  "caves", "cavil", "cawed", "cease", "cecal", "cecum", "cedar", "ceded", "ceder", "cedes",
  "ceiba", "ceils", "celeb", "cella", "cello", "cells", "celts", "cense", "cento", "cents",
  "ceorl", "cered", "ceres", "ceria", "ceros", "cesta", "chads", "chafe", "chaff", "chain",
  "chair", "chalk", "champ", "chams", "chang", "chant", "chaos", "chaps", "chard", "chare",
  "charm", "chars", "chart", "chary", "chase", "chasm", "chats", "cheap", "cheat", "check",
  "cheek", "cheep", "cheer", "chefs", "chert", "chess", "chest", "chews", "chewy", "chick",
  "chide", "chief", "child", "chile", "chili", "chill", "chimb", "chime", "chimp", "china",
  "chine", "chino", "chins", "chips", "chirp", "chits", "chive", "chock", "choir", "choke",
  "chomp", "chops", "chord", "chore", "chose", "chows", "chubs", "chuck", "chugs", "chump",
  "chums", "chunk", "churl", "churn", "chute", "cider", "cigar", "cilia", "cinch", "circa",
  "cisco", "cited", "citer", "cites", "civet", "civic", "civil", "clack", "clade", "clads",
  "clags", "claim", "clamp", "clams", "clang", "clank", "clans", "claps", "claro", "clary",
  "clash", "clasp", "class", "clave", "claws", "clays", "clean", "clear", "cleat", "cleek",
  "clefs", "cleft", "clerk", "clews", "click", "cliff", "climb", "clime", "cline", "cling",
  "clink", "clips", "cloak", "clock", "clods", "clogs", "clomp", "clone", "clops", "close",
  "cloth", "clots", "cloud", "clout", "clove", "clown", "cloys", "clubs", "cluck", "clued",
  "clues", "clump", "clung", "clunk", "coach", "coact", "coals", "coaly", "coast", "coats",
  "cobbs", "cobra", "cocas", "cocks", "cocky", "cocoa", "codas", "coded", "coder", "codes",
  "codex", "codon", "coeds", "cogon", "cohos", "coifs", "coign", "coils", "coins", "coked",
  "cokes", "colas", "colds", "coles", "colic", "colin", "colly", "colon", "color", "colts",
  "comae", "comal", "comas", "combo", "combs", "comer", "comes", "comet", "comfy", "comic",
  "comma", "compo", "comps", "comte", "conch", "condo", "coned", "cones", "coney", "conga",
  "congo", "conic", "conks", "conns", "conte", "conus", "cooch", "cooed", "cooee", "cooer",
  "cooey", "cooks", "cools", "cooly", "coons", "coops", "coopt", "coots", "copal", "copay"
]);

// Game State
let gameState = {
  targetWord: '',
  guesses: [],
  currentGuess: [],
  currentRow: 0,
  gameOver: false,
  won: false,
  letterStates: {}
};

// Stats
let stats = {
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {1:0, 2:0, 3:0, 4:0, 5:0, 6:0}
};

// DOM Elements
let board, keyboard, statsModal, gameOverModal, toastContainer;

// Initialize game on page load
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Get DOM elements
  board = document.getElementById('game-board');
  keyboard = document.getElementById('keyboard');
  statsModal = document.getElementById('stats-modal');
  gameOverModal = document.getElementById('game-over-modal');
  toastContainer = document.getElementById('toast-container');
  
  // Create game board
  createBoard();
  
  // Load stats from localStorage
  loadStats();
  
  // Get today's word or load existing game
  initializeGame();
  
  // Set up event listeners
  setupEventListeners();
}

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.row = i;
    
    for (let j = 0; j < 5; j++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.row = i;
      tile.dataset.col = j;
      tile.dataset.state = 'empty';
      row.appendChild(tile);
    }
    
    board.appendChild(row);
  }
}

function initializeGame() {
  const today = getTodayDateString();
  const savedState = localStorage.getItem(`five-box-state-${today}`);
  
  if (savedState) {
    // Load existing game
    gameState = JSON.parse(savedState);
    restoreBoard();
    updateKeyboard();
    
    if (gameState.gameOver) {
      if (gameState.won) {
        setTimeout(() => showGameOver(true), 100);
      }
    }
  } else {
    // Start new game
    gameState.targetWord = getTodaysWord();
    gameState.guesses = [];
    gameState.currentGuess = [];
    gameState.currentRow = 0;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.letterStates = {};
    saveGameState();
  }
}

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodaysWord() {
  const startDate = new Date('2025-01-01');
  const today = new Date();
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const wordIndex = Math.abs(daysSinceStart) % ANSWER_LIST.length;
  return ANSWER_LIST[wordIndex].toUpperCase();
}

function restoreBoard() {
  // Fill in previous guesses
  gameState.guesses.forEach((guess, rowIndex) => {
    guess.forEach((letter, colIndex) => {
      const tile = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
      tile.textContent = letter;
      
      // Determine tile state
      const evaluation = evaluateGuess(guess);
      tile.dataset.state = evaluation[colIndex];
    });
  });
  
  // Set current row
  gameState.currentRow = gameState.guesses.length;
}

function evaluateGuess(guess) {
  const target = gameState.targetWord.split('');
  const result = new Array(5).fill('absent');
  const targetCounts = {};
  
  // Count target letters
  target.forEach(letter => {
    targetCounts[letter] = (targetCounts[letter] || 0) + 1;
  });
  
  // First pass: mark correct positions
  guess.forEach((letter, i) => {
    if (letter === target[i]) {
      result[i] = 'correct';
      targetCounts[letter]--;
    }
  });
  
  // Second pass: mark present letters
  guess.forEach((letter, i) => {
    if (result[i] === 'absent' && targetCounts[letter] > 0) {
      result[i] = 'present';
      targetCounts[letter]--;
    }
  });
  
  return result;
}

function setupEventListeners() {
  // Keyboard input
  document.addEventListener('keydown', handleKeyPress);
  
  // On-screen keyboard
  keyboard.addEventListener('click', (e) => {
    if (e.target.matches('button[data-key]')) {
      const key = e.target.dataset.key;
      handleInput(key);
    }
  });
  
  // Stats button
  document.getElementById('stats-btn').addEventListener('click', showStats);
  
  // Modal close buttons
  document.getElementById('close-stats').addEventListener('click', () => {
    statsModal.classList.add('hidden');
  });
  
  document.getElementById('close-game-over').addEventListener('click', () => {
    gameOverModal.classList.add('hidden');
  });
  
  // Share buttons
  document.getElementById('share-btn').addEventListener('click', shareResults);
  document.getElementById('share-result-btn').addEventListener('click', shareResults);
}

function handleKeyPress(e) {
  if (gameState.gameOver) return;
  
  if (e.key === 'Enter') {
    handleInput('ENTER');
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    handleInput('BACKSPACE');
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    handleInput(e.key.toUpperCase());
  }
}

function handleInput(key) {
  if (gameState.gameOver) return;
  
  if (key === 'ENTER') {
    submitGuess();
  } else if (key === 'BACKSPACE') {
    deleteLetter();
  } else if (key.length === 1 && gameState.currentGuess.length < 5) {
    addLetter(key);
  }
}

function addLetter(letter) {
  if (gameState.currentGuess.length >= 5) return;
  
  gameState.currentGuess.push(letter);
  const col = gameState.currentGuess.length - 1;
  const tile = document.querySelector(`[data-row="${gameState.currentRow}"][data-col="${col}"]`);
  tile.textContent = letter;
  tile.dataset.state = 'active';
}

function deleteLetter() {
  if (gameState.currentGuess.length === 0) return;
  
  gameState.currentGuess.pop();
  const col = gameState.currentGuess.length;
  const tile = document.querySelector(`[data-row="${gameState.currentRow}"][data-col="${col}"]`);
  tile.textContent = '';
  tile.dataset.state = 'empty';
}

function submitGuess() {
  if (gameState.currentGuess.length !== 5) {
    showToast('Not enough letters');
    shakeRow(gameState.currentRow);
    return;
  }
  
  const guessWord = gameState.currentGuess.join('');
  
  if (!VALID_GUESSES.has(guessWord.toLowerCase())) {
    showToast('Not in word list');
    shakeRow(gameState.currentRow);
    return;
  }
  
  // Evaluate guess
  const evaluation = evaluateGuess(gameState.currentGuess);
  
  // Reveal tiles
  revealTiles(evaluation);
  
  // Update letter states
  gameState.currentGuess.forEach((letter, i) => {
    const currentState = gameState.letterStates[letter];
    const newState = evaluation[i];
    
    // Priority: correct > present > absent
    if (!currentState || 
        (currentState === 'absent' && newState !== 'absent') ||
        (currentState === 'present' && newState === 'correct')) {
      gameState.letterStates[letter] = newState;
    }
  });
  
  // Update keyboard
  updateKeyboard();
  
  // Add to guesses
  gameState.guesses.push([...gameState.currentGuess]);
  
  // Check win condition
  if (guessWord === gameState.targetWord) {
    gameState.gameOver = true;
    gameState.won = true;
    updateStats(true, gameState.currentRow + 1);
    saveGameState();
    setTimeout(() => showGameOver(true), 1500);
    return;
  }
  
  // Check loss condition
  if (gameState.currentRow === 5) {
    gameState.gameOver = true;
    gameState.won = false;
    updateStats(false, -1);
    saveGameState();
    setTimeout(() => showGameOver(false), 1500);
    return;
  }
  
  // Move to next row
  gameState.currentRow++;
  gameState.currentGuess = [];
  saveGameState();
}

function revealTiles(evaluation) {
  const row = document.querySelector(`[data-row="${gameState.currentRow}"]`);
  const tiles = row.querySelectorAll('.tile');
  
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add('flip');
      setTimeout(() => {
        tile.dataset.state = evaluation[i];
      }, 250);
    }, i * 100);
  });
}

function shakeRow(rowIndex) {
  const row = document.querySelector(`[data-row="${rowIndex}"]`);
  row.classList.add('shake');
  setTimeout(() => row.classList.remove('shake'), 500);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

function updateKeyboard() {
  const keys = keyboard.querySelectorAll('button[data-key]');
  keys.forEach(key => {
    const letter = key.dataset.key;
    if (gameState.letterStates[letter]) {
      key.dataset.state = gameState.letterStates[letter];
    }
  });
}

function saveGameState() {
  const today = getTodayDateString();
  localStorage.setItem(`five-box-state-${today}`, JSON.stringify(gameState));
}

function loadStats() {
  const savedStats = localStorage.getItem('five-box-stats');
  if (savedStats) {
    stats = JSON.parse(savedStats);
  }
}

function saveStats() {
  localStorage.setItem('five-box-stats', JSON.stringify(stats));
}

function updateStats(won, numGuesses) {
  stats.gamesPlayed++;
  if (won) {
    stats.wins++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.guessDistribution[numGuesses]++;
  } else {
    stats.currentStreak = 0;
  }
  saveStats();
}

function showStats() {
  // Update stats display
  document.getElementById('games-played').textContent = stats.gamesPlayed;
  document.getElementById('win-percent').textContent = stats.gamesPlayed ? 
    Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  document.getElementById('current-streak').textContent = stats.currentStreak;
  document.getElementById('max-streak').textContent = stats.maxStreak;
  
  // Update guess distribution
  const distributionEl = document.getElementById('guess-distribution');
  distributionEl.innerHTML = '';
  
  const maxCount = Math.max(...Object.values(stats.guessDistribution), 1);
  
  for (let i = 1; i <= 6; i++) {
    const count = stats.guessDistribution[i];
    const percentage = maxCount ? (count / maxCount) * 100 : 0;
    
    const row = document.createElement('div');
    row.className = 'distribution-row';
    
    row.innerHTML = `
      <span class="guess-num">${i}</span>
      <div class="bar ${gameState.won && gameState.guesses.length === i ? 'highlight' : ''}" 
           style="width: ${Math.max(percentage, 7)}%">
        ${count}
      </div>
    `;
    
    distributionEl.appendChild(row);
  }
  
  // Show share button if game is over
  if (gameState.gameOver) {
    document.getElementById('share-btn').classList.remove('hidden');
  } else {
    document.getElementById('share-btn').classList.add('hidden');
  }
  
  statsModal.classList.remove('hidden');
}

function showGameOver(won) {
  const title = document.getElementById('game-over-title');
  const message = document.getElementById('game-over-message');
  
  if (won) {
    const messages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
    title.textContent = messages[gameState.currentRow] || 'You Win!';
    message.textContent = `You got it in ${gameState.currentRow + 1} ${gameState.currentRow === 0 ? 'guess' : 'guesses'}!`;
  } else {
    title.textContent = 'Better luck next time!';
    message.textContent = `The word was ${gameState.targetWord}`;
  }
  
  gameOverModal.classList.remove('hidden');
}

function shareResults() {
  const today = getTodayDateString();
  const guessNum = gameState.won ? gameState.guesses.length : 'X';
  let text = `Five-Box ${today} ${guessNum}/6\n\n`;
  
  gameState.guesses.forEach(guess => {
    const evaluation = evaluateGuess(guess);
    evaluation.forEach(state => {
      if (state === 'correct') text += '🟩';
      else if (state === 'present') text += '🟨';
      else text += '⬜';
    });
    text += '\n';
  });
  
  text += `\nhttps://srp2238.github.io/five-box/`;
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('Results copied to clipboard!');
  });
}