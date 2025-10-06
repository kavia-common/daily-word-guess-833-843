import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import Keyboard from './components/Keyboard';
import { getDailyStatus, submitGuess } from './api/client';
import './styles/theme.css';

/**
 * Internal shell to host the game experience.
 * Maintains guesses and current input, and makes API calls with graceful fallbacks.
 */
function GameShell() {
  const WORD_LENGTH = 6;
  const MAX_ATTEMPTS = 5;
  const { theme } = useTheme();

  const [status, setStatus] = useState('in_progress'); // in_progress | won | lost
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [guesses, setGuesses] = useState([]); // array of strings
  const [feedbacks, setFeedbacks] = useState([]); // array of arrays like ['grey','yellow',...]
  const [current, setCurrent] = useState('');

  // Fetch initial status from backend; fallback to mock if unavailable.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getDailyStatus();
        if (!mounted) return;
        setDate(data.date || '');
        setGuesses(data.guesses || []);
        setFeedbacks(data.attempts || []);
        setStatus(data.status || 'in_progress');
        setMessage(data.message || 'Make your first guess!');
      } catch (e) {
        if (!mounted) return;
        // Graceful fallback
        setMessage('Welcome! Backend unreachable, using local mock.');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canType = status === 'in_progress';
  const attemptsUsed = feedbacks.length;

  // PUBLIC_INTERFACE
  const handleKey = useCallback(async (k) => {
    if (!canType) return;

    if (k === 'ENTER') {
      if (current.length !== WORD_LENGTH) {
        setMessage(`Enter ${WORD_LENGTH} letters.`);
        return;
      }
      // Submit to backend with graceful fallback
      try {
        const resp = await submitGuess(current);
        const nextGuesses = [...guesses, current.toUpperCase()];
        const nextFeedbacks = [...feedbacks, resp.feedback || []];
        setGuesses(nextGuesses);
        setFeedbacks(nextFeedbacks);
        setStatus(resp.status || 'in_progress');
        setMessage(resp.message || '');
        setCurrent('');
      } catch (e) {
        // Simple local mock: randomly color feedback
        const letters = current.toUpperCase().split('');
        const colors = letters.map((_, idx) => {
          const roll = (idx + letters[idx].charCodeAt(0)) % 3;
          return roll === 0 ? 'grey' : roll === 1 ? 'yellow' : 'green';
        });
        const nextGuesses = [...guesses, current.toUpperCase()];
        const nextFeedbacks = [...feedbacks, colors];
        const won = colors.every((c) => c === 'green');
        const newStatus = won ? 'won' : nextFeedbacks.length >= MAX_ATTEMPTS ? 'lost' : 'in_progress';
        setGuesses(nextGuesses);
        setFeedbacks(nextFeedbacks);
        setStatus(newStatus);
        setMessage(won ? 'You won (mock)!' : newStatus === 'lost' ? 'Out of attempts (mock).' : 'Submitted (mock).');
        setCurrent('');
      }
      return;
    }

    if (k === 'BACK') {
      if (current.length > 0) setCurrent((p) => p.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/.test(k)) {
      if (current.length < WORD_LENGTH) setCurrent((p) => p + k);
      return;
    }
  }, [canType, current, feedbacks, guesses]);

  // Physical keyboard support
  useEffect(() => {
    const onDown = (e) => {
      const key = e.key;
      if (!canType) return;
      if (key === 'Enter') handleKey('ENTER');
      else if (key === 'Backspace') handleKey('BACK');
      else if (/^[a-zA-Z]$/.test(key)) handleKey(key.toUpperCase());
    };
    window.addEventListener('keydown', onDown);
    return () => window.removeEventListener('keydown', onDown);
  }, [handleKey, canType]);

  const filledRows = useMemo(() => feedbacks.length, [feedbacks]);

  return (
    <div className="app-root" data-theme={theme}>
      <Header />
      <main className="container" role="main" aria-live="polite">
        <div className="status" aria-atomic="true">
          {message} {date ? `• Day: ${date}` : ''}
        </div>
        <GameGrid
          wordLength={WORD_LENGTH}
          maxAttempts={MAX_ATTEMPTS}
          feedbacks={feedbacks}
          guesses={guesses}
          current={current}
          status={status}
        />
        <Keyboard onKey={handleKey} status={status} />
        <div className="footer-note">
          Attempts: {attemptsUsed}/{MAX_ATTEMPTS} {status !== 'in_progress' ? `• ${status.toUpperCase()}` : ''}
        </div>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Root App component: wraps GameShell in ThemeProvider.
 */
function App() {
  return (
    <ThemeProvider>
      <GameShell />
    </ThemeProvider>
  );
}

export default App;
