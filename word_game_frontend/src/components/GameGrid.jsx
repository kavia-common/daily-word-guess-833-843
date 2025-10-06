import React from 'react';

/**
 * Tile for a single letter cell.
 */
function Tile({ letter, state }) {
  const classes = ['tile'];
  if (letter) classes.push('filled');
  if (state) classes.push(state); // 'green' | 'yellow' | 'grey'
  return (
    <div
      className={classes.join(' ')}
      role="gridcell"
      aria-label={letter ? `Letter ${letter}` : 'Empty'}
      aria-live="polite"
    >
      {letter}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * GameGrid displays previous feedback rows and active input row.
 */
function GameGrid({ wordLength, maxAttempts, feedbacks, guesses, current, status }) {
  const rows = [];
  for (let r = 0; r < maxAttempts; r += 1) {
    const rowCells = [];
    const clue = feedbacks[r];
    const guess = guesses[r];
    if (clue && guess) {
      for (let c = 0; c < wordLength; c += 1) {
        rowCells.push(<Tile key={c} letter={guess[c]} state={clue[c]} />);
      }
    } else if (r === feedbacks.length && status === 'in_progress') {
      for (let c = 0; c < wordLength; c += 1) {
        const ch = current[c] || '';
        rowCells.push(<Tile key={c} letter={ch} />);
      }
    } else {
      for (let c = 0; c < wordLength; c += 1) {
        rowCells.push(<Tile key={c} letter="" />);
      }
    }
    rows.push(
      <div className="row" role="row" key={`row-${r}`}>
        {rowCells}
      </div>
    );
  }

  return (
    <section className="board" role="grid" aria-label="Guess grid">
      {rows}
    </section>
  );
}

export default GameGrid;
