// ============================================
// FIVE-BOX - Game Logic
// ============================================
// Word lists are loaded from words.js (ANSWER_LIST and VALID_GUESSES)

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

// Hard Mode
let hardMode = false;

// DOM Elements
let board, keyboard, statsModal, gameOverModal, toastContainer, helpModal;

// Initialize game on page load
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Get DOM elements
  board = document.getElementById('game-board');
  keyboard = document.getElementById('keyboard');
  statsModal = document.getElementById('stats-modal');
  gameOverModal = document.getElementById('game-over-modal');
  toastContainer = document.getElementById('toast-container');
  helpModal = document.getElementById('help-modal');
  
  // Load theme preference
  const savedTheme = localStorage.getItem('five-box-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-btn').textContent = '☀️';
  }
  
  // Load hard mode preference
  hardMode = localStorage.getItem('five-box-hard-mode') === 'true';
  const hardModeCheck = document.getElementById('hard-mode-check');
  hardModeCheck.checked = hardMode;
  
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
  
  // currentRow is already correctly set from saved state
  // Only set it if state was not previously saved (fallback)
  if (gameState.currentRow === undefined || gameState.currentRow === null) {
    gameState.currentRow = gameState.guesses.length;
  }
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
  
  // Help modal
  document.getElementById('help-btn').addEventListener('click', () => {
    helpModal.classList.remove('hidden');
  });
  document.getElementById('close-help').addEventListener('click', () => {
    helpModal.classList.add('hidden');
  });
  
  // Hard mode toggle
  document.getElementById('hard-mode-check').addEventListener('change', (e) => {
    if (e.target.checked && gameState.guesses.length > 0 && !gameState.gameOver) {
      showToast('Hard Mode can only be enabled at the start of a round');
      e.target.checked = false;
      return;
    }
    hardMode = e.target.checked;
    localStorage.setItem('five-box-hard-mode', hardMode);
  });
  
  // Theme toggle
  document.getElementById('theme-btn').addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    document.getElementById('theme-btn').textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('five-box-theme', isLight ? 'light' : 'dark');
  });
  
  // Reset button
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm('Reset today\'s game? This will clear your progress and let you replay the same word.')) {
      return;
    }
    const today = getTodayDateString();
    localStorage.removeItem(`five-box-state-${today}`);
    // Close any open modals
    statsModal.classList.add('hidden');
    gameOverModal.classList.add('hidden');
    // Reset game state
    gameState = {
      targetWord: getTodaysWord(),
      guesses: [],
      currentGuess: [],
      currentRow: 0,
      gameOver: false,
      won: false,
      letterStates: {}
    };
    // Rebuild board and reset keyboard
    createBoard();
    const keys = keyboard.querySelectorAll('button[data-key]');
    keys.forEach(key => { key.removeAttribute('data-state'); });
    saveGameState();
    showToast('Game reset!');
  });
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
  
  // Hard mode validation
  if (hardMode && gameState.guesses.length > 0) {
    const hardModeError = checkHardMode(gameState.currentGuess);
    if (hardModeError) {
      showToast(hardModeError);
      shakeRow(gameState.currentRow);
      return;
    }
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
    // Bounce animation after flip completes
    setTimeout(() => {
      const row = document.querySelectorAll(`[data-row="${gameState.currentRow}"]`);
      const tiles = document.querySelectorAll(`.tile[data-row="${gameState.currentRow}"]`);
      tiles.forEach((tile, i) => {
        setTimeout(() => tile.classList.add('bounce'), i * 100);
      });
    }, 600);
    setTimeout(() => showGameOver(true), 2000);
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

function checkHardMode(currentGuess) {
  const lastGuess = gameState.guesses[gameState.guesses.length - 1];
  const lastEval = evaluateGuess(lastGuess);
  
  // Check that all correct letters are in the same position
  for (let i = 0; i < 5; i++) {
    if (lastEval[i] === 'correct' && currentGuess[i] !== lastGuess[i]) {
      const pos = ['1st','2nd','3rd','4th','5th'][i];
      return `${pos} letter must be ${lastGuess[i]}`;
    }
  }
  
  // Check that all present letters are included somewhere
  for (let i = 0; i < 5; i++) {
    if (lastEval[i] === 'present') {
      if (!currentGuess.includes(lastGuess[i])) {
        return `Guess must contain ${lastGuess[i]}`;
      }
    }
  }
  
  return null;
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