// ponytail: accounts + passwords live in localStorage (client-only prototype).
// No server, no hashing — swap for a real backend (hashed passwords, DB) before handling real users.

const USERS_KEY = 'veycron-users';
const SESSION_KEY = 'veycron-session';

// Always works, regardless of registration — for your own testing.
const TEST_ACCOUNT = { email: 'test@test.de', password: '12345678' };

type StoredUser = { email: string; password: string };
type AuthResult = { ok: true } | { ok: false; error: string };

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users: StoredUser[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* ignore */ }
}
function setSession(email: string) {
  try { localStorage.setItem(SESSION_KEY, email); } catch { /* ignore */ }
}

export function register(email: string, password: string): AuthResult {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return { ok: false, error: 'Bitte E-Mail und Passwort angeben.' };
  if (password.length < 8) return { ok: false, error: 'Das Passwort muss mindestens 8 Zeichen haben.' };
  if (normalized === TEST_ACCOUNT.email) return { ok: false, error: 'Für diese E-Mail existiert bereits ein Konto.' };
  const users = getUsers();
  if (users.some((u) => u.email === normalized)) return { ok: false, error: 'Für diese E-Mail existiert bereits ein Konto.' };
  saveUsers([...users, { email: normalized, password }]);
  setSession(normalized);
  return { ok: true };
}

export function login(email: string, password: string): AuthResult {
  const normalized = email.trim().toLowerCase();
  if (normalized === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
    setSession(normalized);
    return { ok: true };
  }
  const match = getUsers().find((u) => u.email === normalized && u.password === password);
  if (!match) return { ok: false, error: 'E-Mail oder Passwort ist falsch.' };
  setSession(normalized);
  return { ok: true };
}

export function logout() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

export function getCurrentUser(): string | null {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
}
