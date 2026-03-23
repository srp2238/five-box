// ============================================
// FIVE-BOX - Test Suite
// ============================================
// Run with: node tests.js

const assert = require('assert');
const { ANSWER_LIST, VALID_GUESSES } = require('./words.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${e.message}`);
  }
}

// ============================================
// Guess Evaluation (pure logic from app.js)
// ============================================
function evaluateGuess(guess, targetWord) {
  const target = targetWord.split('');
  const result = new Array(5).fill('absent');
  const targetCounts = {};

  target.forEach(letter => {
    targetCounts[letter] = (targetCounts[letter] || 0) + 1;
  });

  guess.forEach((letter, i) => {
    if (letter === target[i]) {
      result[i] = 'correct';
      targetCounts[letter]--;
    }
  });

  guess.forEach((letter, i) => {
    if (result[i] === 'absent' && targetCounts[letter] > 0) {
      result[i] = 'present';
      targetCounts[letter]--;
    }
  });

  return result;
}

// Hard mode check (pure logic from app.js)
function checkHardMode(currentGuess, lastGuess, targetWord) {
  const lastEval = evaluateGuess(lastGuess, targetWord);

  for (let i = 0; i < 5; i++) {
    if (lastEval[i] === 'correct' && currentGuess[i] !== lastGuess[i]) {
      const pos = ['1st','2nd','3rd','4th','5th'][i];
      return `${pos} letter must be ${lastGuess[i]}`;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (lastEval[i] === 'present') {
      if (!currentGuess.includes(lastGuess[i])) {
        return `Guess must contain ${lastGuess[i]}`;
      }
    }
  }

  return null;
}

// Deterministic pseudo-random index (mirrors app.js seededIndex)
function seededIndex(day, listLength) {
  let h = day;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return Math.abs(h) % listLength;
}

// Daily word selection (pure logic from app.js)
function getTodaysWord(date) {
  const startDate = new Date('2025-01-01');
  const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  const wordIndex = seededIndex(Math.abs(daysSinceStart), ANSWER_LIST.length);
  return ANSWER_LIST[wordIndex].toUpperCase();
}

// Stats update (pure logic from app.js)
function updateStats(stats, won, numGuesses) {
  const updated = { ...stats, guessDistribution: { ...stats.guessDistribution } };
  updated.gamesPlayed++;
  if (won) {
    updated.wins++;
    updated.currentStreak++;
    updated.maxStreak = Math.max(updated.maxStreak, updated.currentStreak);
    updated.guessDistribution[numGuesses]++;
  } else {
    updated.currentStreak = 0;
  }
  return updated;
}

// ============================================
// WORD LIST TESTS
// ============================================
console.log('\n📋 Word List Tests');

test('ANSWER_LIST is not empty', () => {
  assert.ok(ANSWER_LIST.length > 0, 'ANSWER_LIST should have entries');
});

test('All answer words are exactly 5 letters', () => {
  const bad = ANSWER_LIST.filter(w => w.length !== 5);
  assert.deepStrictEqual(bad, [], `Words not 5 letters: ${bad.join(', ')}`);
});

test('All answer words are lowercase alpha only', () => {
  const bad = ANSWER_LIST.filter(w => !/^[a-z]{5}$/.test(w));
  assert.deepStrictEqual(bad, [], `Invalid words: ${bad.join(', ')}`);
});

test('No duplicate answer words', () => {
  const seen = new Set();
  const dupes = [];
  ANSWER_LIST.forEach(w => {
    if (seen.has(w)) dupes.push(w);
    seen.add(w);
  });
  assert.deepStrictEqual(dupes, [], `Duplicates: ${dupes.join(', ')}`);
});

test('ANSWER_LIST is sorted alphabetically', () => {
  for (let i = 1; i < ANSWER_LIST.length; i++) {
    if (ANSWER_LIST[i] < ANSWER_LIST[i - 1]) {
      assert.fail(`"${ANSWER_LIST[i]}" comes after "${ANSWER_LIST[i - 1]}" at index ${i}`);
    }
  }
});

test('All answer words are in VALID_GUESSES', () => {
  const missing = ANSWER_LIST.filter(w => !VALID_GUESSES.has(w));
  assert.deepStrictEqual(missing, [], `Answers missing from valid guesses: ${missing.join(', ')}`);
});

test('All valid guesses are exactly 5 letters', () => {
  const bad = [...VALID_GUESSES].filter(w => w.length !== 5);
  assert.deepStrictEqual(bad, [], `Words not 5 letters: ${bad.join(', ')}`);
});

test('No valid guess contains non-alpha characters', () => {
  const bad = [...VALID_GUESSES].filter(w => !/^[a-z]{5}$/.test(w));
  assert.deepStrictEqual(bad, [], `Invalid guesses: ${bad.join(', ')}`);
});

test('"meals" is in ANSWER_LIST', () => {
  assert.ok(ANSWER_LIST.includes('meals'), '"meals" should be an answer');
});

test('"meals" is in VALID_GUESSES', () => {
  assert.ok(VALID_GUESSES.has('meals'), '"meals" should be a valid guess');
});

test('Common 5-letter words are in VALID_GUESSES', () => {
  const common = ['about','house','world','water','music','money','meals','dream','smile','phone'];
  const missing = common.filter(w => !VALID_GUESSES.has(w));
  assert.deepStrictEqual(missing, [], `Common words missing: ${missing.join(', ')}`);
});

// ============================================
// GUESS EVALUATION TESTS
// ============================================
console.log('\n🎯 Guess Evaluation Tests');

test('All correct letters', () => {
  const result = evaluateGuess(['H','E','L','L','O'], 'HELLO');
  assert.deepStrictEqual(result, ['correct','correct','correct','correct','correct']);
});

test('All absent letters', () => {
  const result = evaluateGuess(['X','Y','Z','Q','W'], 'HELLO');
  assert.deepStrictEqual(result, ['absent','absent','absent','absent','absent']);
});

test('Mixed correct, present, and absent', () => {
  const result = evaluateGuess(['H','O','L','E','S'], 'HELLO');
  assert.deepStrictEqual(result, ['correct','present','correct','present','absent']);
});

test('Duplicate letter: one correct, one absent', () => {
  // Target HELLO has one H. Guess HATCH: first H correct, second H absent (only 1 H in target)
  const result = evaluateGuess(['H','A','T','C','H'], 'HELLO');
  assert.strictEqual(result[0], 'correct');
  assert.strictEqual(result[4], 'absent');
});

test('Duplicate letter in guess with double in target', () => {
  // Target ALLOY has two L's. Guess LLAMA: first L present, second L correct
  const result = evaluateGuess(['L','L','A','M','A'], 'ALLOY');
  assert.strictEqual(result[0], 'present');
  assert.strictEqual(result[1], 'correct');
});

test('Present letter not marked when already accounted for as correct', () => {
  // Target SUGAR. Guess ARRAS: first A is absent (no extra A after 4th pos), 
  // R at pos 2 is absent, R at pos 3 is absent, A at pos 4 is correct, S at pos 5 is present
  const result = evaluateGuess(['A','R','R','A','S'], 'SUGAR');
  assert.strictEqual(result[3], 'correct'); // A in correct position
  assert.strictEqual(result[0], 'absent');  // extra A, already accounted for
});

test('Evaluation returns array of length 5', () => {
  const result = evaluateGuess(['A','B','C','D','E'], 'FGHIJ');
  assert.strictEqual(result.length, 5);
});

// ============================================
// DAILY WORD SELECTION TESTS
// ============================================
console.log('\n📅 Daily Word Selection Tests');

test('Returns a valid uppercase word', () => {
  const word = getTodaysWord(new Date('2025-06-15'));
  assert.ok(/^[A-Z]{5}$/.test(word), `Expected 5 uppercase letters, got "${word}"`);
});

test('Same date returns same word', () => {
  const w1 = getTodaysWord(new Date('2025-03-01'));
  const w2 = getTodaysWord(new Date('2025-03-01'));
  assert.strictEqual(w1, w2);
});

test('Different dates return different words (adjacent days)', () => {
  const w1 = getTodaysWord(new Date('2025-03-01'));
  const w2 = getTodaysWord(new Date('2025-03-02'));
  assert.notStrictEqual(w1, w2);
});

test('Word index wraps around ANSWER_LIST', () => {
  // Day far in the future should still produce a valid word
  const word = getTodaysWord(new Date('2035-01-01'));
  assert.ok(ANSWER_LIST.includes(word.toLowerCase()), `"${word}" should be in ANSWER_LIST`);
});

test('Start date (2025-01-01) returns a valid word (seeded, not first)', () => {
  const word = getTodaysWord(new Date('2025-01-01'));
  assert.ok(ANSWER_LIST.includes(word.toLowerCase()), `"${word}" should be in ANSWER_LIST`);
  // Day 0 hashes to a pseudo-random index, so it won't be the first word
});

test('Word sequence is not alphabetical (pseudo-random)', () => {
  const words = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date('2025-01-01');
    d.setDate(d.getDate() + i);
    words.push(getTodaysWord(d));
  }
  // Check that the 10 consecutive words are NOT sorted alphabetically
  const sorted = [...words].sort();
  const isSorted = words.every((w, i) => w === sorted[i]);
  assert.ok(!isSorted, 'Consecutive daily words should not be in alphabetical order');
});

// ============================================
// HARD MODE TESTS
// ============================================
console.log('\n🔒 Hard Mode Tests');

test('Hard mode passes when all constraints are satisfied', () => {
  // Last guess: CRANE, target: CREST → C correct, R correct, E present
  // New guess CREST: C stays at pos 0, R stays at pos 1, E is included
  const err = checkHardMode(
    ['C','R','E','S','T'],
    ['C','R','A','N','E'],
    'CREST'
  );
  assert.strictEqual(err, null);
});

test('Hard mode fails when correct letter moves', () => {
  const err = checkHardMode(
    ['X','R','A','N','E'],  // C moved away from pos 0
    ['C','R','A','N','E'],
    'CREST'
  );
  assert.ok(err !== null, 'Should return an error');
  assert.ok(err.includes('1st'), `Error should mention 1st position: ${err}`);
});

test('Hard mode fails when present letter is omitted', () => {
  // Target CREST, last guess CRANE → E is present. New guess without E should fail.
  const err = checkHardMode(
    ['C','R','U','S','T'],
    ['C','R','A','N','E'],
    'CREST'
  );
  // E was present in CRANE (pos 4), E is in CREST at pos 2. 
  // CRUST has no E → should fail
  assert.ok(err !== null, 'Should fail when present letter E is omitted from CRUST');
});

test('Hard mode allows present letter in different position', () => {
  // Target CREST, last guess CRANE → E is present
  // New guess CRUEL has E at pos 4 (different from original pos 4, but present)
  const err = checkHardMode(
    ['C','R','E','S','T'],
    ['C','R','A','N','E'],
    'CREST'
  );
  assert.strictEqual(err, null, 'Should allow present letter in new position');
});

// ============================================
// STATS TESTS
// ============================================
console.log('\n📊 Stats Tests');

test('Win increments games played, wins, and streak', () => {
  const initial = { gamesPlayed: 0, wins: 0, currentStreak: 0, maxStreak: 0, guessDistribution: {1:0,2:0,3:0,4:0,5:0,6:0} };
  const result = updateStats(initial, true, 3);
  assert.strictEqual(result.gamesPlayed, 1);
  assert.strictEqual(result.wins, 1);
  assert.strictEqual(result.currentStreak, 1);
  assert.strictEqual(result.guessDistribution[3], 1);
});

test('Loss resets current streak', () => {
  const initial = { gamesPlayed: 5, wins: 4, currentStreak: 4, maxStreak: 4, guessDistribution: {1:0,2:1,3:2,4:1,5:0,6:0} };
  const result = updateStats(initial, false, -1);
  assert.strictEqual(result.currentStreak, 0);
  assert.strictEqual(result.maxStreak, 4); // maxStreak preserved
  assert.strictEqual(result.gamesPlayed, 6);
});

test('Max streak updates on new record', () => {
  const initial = { gamesPlayed: 3, wins: 3, currentStreak: 3, maxStreak: 3, guessDistribution: {1:1,2:1,3:1,4:0,5:0,6:0} };
  const result = updateStats(initial, true, 2);
  assert.strictEqual(result.maxStreak, 4);
  assert.strictEqual(result.currentStreak, 4);
});

test('Max streak not reduced after loss', () => {
  const initial = { gamesPlayed: 5, wins: 4, currentStreak: 2, maxStreak: 4, guessDistribution: {1:0,2:1,3:2,4:1,5:0,6:0} };
  const result = updateStats(initial, false, -1);
  assert.strictEqual(result.maxStreak, 4);
});

test('Guess distribution tracks correct bucket', () => {
  const initial = { gamesPlayed: 0, wins: 0, currentStreak: 0, maxStreak: 0, guessDistribution: {1:0,2:0,3:0,4:0,5:0,6:0} };
  const after1 = updateStats(initial, true, 1);
  const after6 = updateStats(after1, true, 6);
  assert.strictEqual(after6.guessDistribution[1], 1);
  assert.strictEqual(after6.guessDistribution[6], 1);
  assert.strictEqual(after6.guessDistribution[3], 0);
});

// ============================================
// RESULTS
// ============================================
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);
