import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

// PUBLIC_INTERFACE
export async function getStatus() {
  /** Fetch game status from backend. */
  const resp = await client.get("/api/status");
  return resp.data;
}

// PUBLIC_INTERFACE
export async function postGuess(guess) {
  /** Submit a guess string, returns feedback and game status. */
  const resp = await client.post("/api/guess", { guess });
  return resp.data;
}
