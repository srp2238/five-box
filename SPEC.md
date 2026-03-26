# Five-Box — Project Specification

## Overview

Five-Box is a Wordle-inspired word-guessing game built as a static web application. Players have 6 attempts to guess a hidden 5-letter word. After each guess, tiles are color-coded to indicate correct letters (green), misplaced letters (yellow), and absent letters (gray). A new target word is assigned each day based on a deterministic date-based index.

**Live URL:** https://srp2238.github.io/five-box/

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Vanilla HTML / CSS / JavaScript     |
| Hosting     | Netlify (static site)               |
| Tests       | Node.js + `assert` (custom runner)  |
| Build       | None — no bundler or framework      |

---

## File Structure

```
five-box/
├── index.html        # Single-page HTML shell (game board, keyboard, modals)
├── app.js            # Core game logic, state management, event handling
├── words.js          # Word lists (ANSWER_LIST array + VALID_GUESSES Set)
├── style.css         # All styling, theming, animations, responsive breakpoints
├── tests.js          # Node-based unit test suite
├── netlify.toml      # Netlify deploy config (publish root ".", SPA redirect)
└── .gitignore        # Standard ignores
```

---

## Game Rules

1. The player has **6 guesses** to identify the daily 5-letter target word.
2. Each guess must be a **valid 5-letter English word** (checked against `VALID_GUESSES`).
3. After submission, each tile is evaluated:
   - **Correct (green):** Letter is in the word and in the correct position.
   - **Present (yellow):** Letter is in the word but in the wrong position.
   - **Absent (gray):** Letter is not in the word (or all instances are already accounted for).
4. The on-screen keyboard reflects the best-known state of each letter (priority: correct > present > absent).
5. A new word is available every calendar day.

### Hard Mode

- Can only be enabled **before the first guess** of a round.
- All **correct** letters from the previous guess must remain in the same position.
- All **present** letters from the previous guess must appear somewhere in the next guess.
- Persisted via `localStorage` key `five-box-hard-mode`.

---

## Core Logic

### Daily Word Selection (`getTodaysWord`)

- **Epoch:** March 26, 2026
- **Algorithm:** `seededIndex(daysSinceEpoch, ANSWER_LIST.length)` — a deterministic integer hash maps the day number to a pseudo-random index so the word sequence is not alphabetical.
- Deterministic — same date always yields the same word.

### Guess Evaluation (`evaluateGuess`)

Two-pass algorithm:
1. **First pass:** Mark exact matches as `correct`, decrement target letter counts.
2. **Second pass:** Mark remaining letters as `present` if available in target counts, otherwise `absent`.

Handles duplicate letters correctly (e.g., guessing a letter twice when it appears once in the target).

### Hard Mode Validation (`checkHardMode`)

- Compares current guess against the **last submitted guess** and its evaluation.
- Returns an error string if constraints are violated, or `null` if valid.

---

## State Management

All state is persisted in **`localStorage`**:

| Key                              | Description                              |
|----------------------------------|------------------------------------------|
| `five-box-v2-{YYYY-MM-DD}`      | Current game state (JSON): `targetWord`, `guesses`, `currentGuess`, `currentRow`, `gameOver`, `won`, `letterStates` |
| `five-box-stats`                 | Cumulative stats (JSON): `gamesPlayed`, `wins`, `currentStreak`, `maxStreak`, `guessDistribution` |
| `five-box-theme`                 | `"light"` or absent (dark default)       |
| `five-box-hard-mode`             | `"true"` or `"false"`                    |

### Game State Shape

```js
{
  targetWord: string,        // Uppercase 5-letter word
  guesses: string[][],       // Array of submitted guesses (each is array of 5 letters)
  currentGuess: string[],    // Letters typed so far in current row
  currentRow: number,        // 0–5
  gameOver: boolean,
  won: boolean,
  letterStates: { [letter]: 'correct' | 'present' | 'absent' }
}
```

### Stats Shape

```js
{
  gamesPlayed: number,
  wins: number,
  currentStreak: number,
  maxStreak: number,
  guessDistribution: { 1: n, 2: n, 3: n, 4: n, 5: n, 6: n }
}
```

---

## Word Lists (`words.js`)

- **`ANSWER_LIST`**: ~2,300 common 5-letter words (possible daily answers). Sorted alphabetically, lowercase, no duplicates.
- **`VALID_GUESSES`**: `Set` containing all answer words **plus** thousands of additional valid 5-letter English words. Used for guess validation.

---

## UI Components

### Game Board

- 6 rows × 5 tiles, generated dynamically by `createBoard()`.
- Each tile has `data-row`, `data-col`, and `data-state` attributes.
- Tile states: `empty`, `active`, `correct`, `present`, `absent`.

### On-Screen Keyboard

- 3 rows: QWERTY layout with `ENTER` and `BACKSPACE` (⌫) as wide keys.
- Keyboard buttons carry `data-key` and optionally `data-state` for color feedback.

### Modals

| Modal               | Trigger               | Contents                                          |
|---------------------|-----------------------|---------------------------------------------------|
| **Help**            | `?` button            | Rules, color examples, hard mode explanation       |
| **Statistics**      | 📊 button             | Games played, win %, streaks, guess distribution bar chart, share button |
| **Game Over**       | Auto after win/loss   | Result message, share button                       |
| **Reset Confirm**   | 🔄 button             | Confirmation prompt to reset today's game          |

### Toast Notifications

- Temporary messages (2s) for errors ("Not in word list", "Not enough letters") and confirmations.
- Appended to `#toast-container`, auto-removed after timeout.

---

## Animations

| Animation  | Trigger                  | CSS Details                    |
|------------|--------------------------|--------------------------------|
| **Pop**    | Letter typed             | Quick scale 1 → 1.1 → 1       |
| **Flip**   | Guess submitted          | `rotateX` 0 → -90° → 0, staggered per tile (100ms delay) |
| **Shake**  | Invalid guess            | Horizontal shake on the row    |
| **Bounce** | Winning guess            | Vertical bounce, staggered per tile |
| **Fade In**| Toast shown              | Opacity + translateY           |

---

## Theming

- **Dark mode** (default): Dark background (#121213), light text.
- **Light mode**: White background, dark text.
- Toggled via 🌙/☀️ button; persisted in `localStorage`.
- Implemented with CSS custom properties on `:root` and `body.light-mode`.

### CSS Custom Properties

```
--bg-color, --tile-bg, --tile-border, --tile-empty-border,
--correct, --present, --absent, --text-color,
--key-bg, --header-border, --modal-bg, --modal-border
```

---

## Responsive Design

| Breakpoint               | Adjustments                                       |
|--------------------------|---------------------------------------------------|
| `min-width: 500px`       | Larger header, show "Hard" label, bigger buttons   |
| `max-width: 374px`       | Smaller header/buttons for small phones (iPhone SE) |
| `max-height: 600px`      | Compact spacing for short viewports / landscape    |
| `max-height: 480px`      | Ultra-compact for landscape phones                 |

### Mobile Optimizations

- `viewport-fit=cover` + `env(safe-area-inset-*)` for notched devices.
- `touch-action: manipulation` on interactive elements.
- Rubber-band scroll prevention via `touchmove` listener.
- Visual viewport resize handler for mobile address bar show/hide.
- `-webkit-tap-highlight-color: transparent`.

---

## Sharing

`shareResults()` builds an emoji grid and copies to clipboard:

```
Five-Box 2025-03-20 4/6

⬜🟨⬜⬜⬜
⬜🟩⬜🟩⬜
🟩🟩⬜🟩🟩
🟩🟩🟩🟩🟩

https://srp2238.github.io/five-box/
```

---

## Reset Feature

- 🔄 button opens a confirmation modal.
- On confirm:
  1. Removes today's `localStorage` state.
  2. Resets `gameState` to fresh defaults (same target word).
  3. Rebuilds board and clears keyboard colors.
- Does **not** affect cumulative stats.

---

## Test Suite (`tests.js`)

Run with `node tests.js`. Custom test runner using Node `assert`.

### Test Categories

| Category               | Count | What's Tested                                                |
|------------------------|-------|--------------------------------------------------------------|
| **Word Lists**         | 10    | Non-empty, 5-letter, lowercase, no dupes, sorted, answers ⊂ valid guesses, specific words present |
| **Guess Evaluation**   | 7     | All correct/absent/mixed, duplicate letter handling, array length |
| **Daily Word Selection**| 5    | Valid format, deterministic, different days ≠ same word, wrap-around, epoch start |
| **Hard Mode**          | 4     | Pass when valid, fail on moved correct letter, fail on missing present letter, allow repositioned present letter |
| **Stats**              | 5     | Win increments, loss resets streak, max streak update, max streak preserved, distribution buckets |

**Total: 31 tests**

---

## Deployment

- **Platform:** Netlify
- **Config:** `netlify.toml` — publishes root directory, no build command, SPA redirect (`/* → /index.html`, status 200).
- No build step required — all files are served as-is.

---

## Dependencies

- **Runtime:** None (vanilla JS, no npm packages in browser).
- **Test-time:** Node.js `assert` module (built-in). `words.js` is required via CommonJS (`require`).
