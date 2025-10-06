import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/**
 * PUBLIC_INTERFACE
 * Fetch current daily game status from backend.
 */
export async function getDailyStatus() {
  try {
    const resp = await http.get('/api/status');
    return resp.data;
  } catch (e) {
    // Rethrow to let caller decide how to fallback
    throw e;
  }
}

/**
 * PUBLIC_INTERFACE
 * Submit a guess; returns server-evaluated feedback or throws on error.
 */
export async function submitGuess(guess) {
  try {
    const resp = await http.post('/api/guess', { guess });
    return resp.data;
  } catch (e) {
    throw e;
  }
}
