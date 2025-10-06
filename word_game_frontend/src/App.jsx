import React, { useEffect, useMemo, useState, useCallback } from "react";
import { getStatus, postGuess } from "./utils/api";
import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";

const WORD_LENGTH = 6;
const MAX_ATTEMPTS = 5;

function App() {
  const [date, setDate] = useState("");
  const [guesses, setGuesses] = useState([]); // strings
  const [feedbacks, setFeedbacks] = useState([]); // list of list
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [message, setMessage] = useState("Loading...");
  const attemptsUsed = feedbacks.length;

  const canType = status === "in_progress";
  const remainingRows = MAX_ATTEMPTS - feedbacks.length;

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getStatus();
      setDate(data.date);
      setGuesses(data.guesses || []);
      setFeedbacks(data.attempts || []);
      setStatus(data.status || "in_progress");
      setMessage(data.message || "");
      setCurrent("");
    } catch (e) {
      setMessage("Could not connect to backend.");
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const onKey = useCallback(
    async (k) => {
      if (!canType) return;

      if (k === "ENTER") {
        if (current.length !== WORD_LENGTH) {
          setMessage(`Enter ${WORD_LENGTH} letters`);
          return;
        }
        try {
          const res = await postGuess(current);
          const newGuesses = [...guesses, current.toUpperCase()];
          const newFeedbacks = [...feedbacks, res.feedback];
          setGuesses(newGuesses);
          setFeedbacks(newFeedbacks);
          setStatus(res.status);
          setMessage(res.message);
          setCurrent("");
        } catch (e) {
          setMessage("Invalid guess or server error.");
        }
        return;
      }

      if (k === "BACK") {
        if (current.length > 0) {
          setCurrent(current.slice(0, -1));
        }
        return;
      }

      if (/^[A-Z]$/.test(k)) {
        if (current.length < WORD_LENGTH) {
          setCurrent((prev) => prev + k);
        }
      }
    },
    [canType, current, guesses, feedbacks]
  );

  // Keyboard physical input
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (!canType) return;
      if (key === "Enter") onKey("ENTER");
      else if (key === "Backspace") onKey("BACK");
      else if (/^[a-zA-Z]$/.test(key)) onKey(key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey, canType]);

  const filledRows = useMemo(() => feedbacks.length, [feedbacks]);

  return (
    <>
      <header className="app-header" role="banner" aria-label="Daily Word Game">
        <div className="app-title">Ocean Word Splash</div>
      </header>
      <main className="container" role="main">
        <div className="status" aria-live="polite">
          {message}
        </div>

        <GameBoard
          wordLength={WORD_LENGTH}
          maxAttempts={MAX_ATTEMPTS}
          feedbacks={feedbacks}
          guesses={guesses}
          current={current}
          status={status}
        />

        <Keyboard onKey={onKey} status={status} />

        <div className="footer-note">
          Day: {date} • Attempts: {attemptsUsed}/{MAX_ATTEMPTS}
        </div>
      </main>
    </>
  );
}

export default App;
