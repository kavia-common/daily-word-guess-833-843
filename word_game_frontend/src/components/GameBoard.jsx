import React from "react";

function Tile({ letter, state }) {
  const classes = ["tile"];
  if (letter) classes.push("filled");
  if (state) classes.push(state); // green, yellow, grey
  return <div className={classes.join(" ")} aria-label={letter || "empty"}>{letter}</div>;
}

// PUBLIC_INTERFACE
function GameBoard({ wordLength, maxAttempts, feedbacks, guesses, current, status }) {
  /** Render the game board grid with past feedback and current input row. */
  const rows = [];

  for (let r = 0; r < maxAttempts; r++) {
    const rowLetters = [];
    const clue = feedbacks[r];
    const guess = guesses[r];

    if (clue && guess) {
      for (let c = 0; c < wordLength; c++) {
        rowLetters.push(<Tile key={c} letter={guess[c]} state={clue[c]} />);
      }
    } else if (r === feedbacks.length && status === "in_progress") {
      // current row
      for (let c = 0; c < wordLength; c++) {
        const ch = current[c] || "";
        rowLetters.push(<Tile key={c} letter={ch} />);
      }
    } else {
      for (let c = 0; c < wordLength; c++) {
        rowLetters.push(<Tile key={c} letter="" />);
      }
    }

    rows.push(<div key={r} className="row">{rowLetters}</div>);
  }

  return <section className="board" aria-label="Game board">{rows}</section>;
}

export default GameBoard;
