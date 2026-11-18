// ponytail: client-only accounts in localStorage — this gates the UI, it is not security.
// Anyone with the JS bundle can read TEST_ACCOUNT. Real protection needs a backend (server-side hashing + sessions).

const USERS_KEY = 'veycron-users';
const SESSION_KEY = 'veycron-session';

// Always works, regardless of registration — for your own testing.
const TEST_ACCOUNT = { email: 'test@test.de', password: '12345678' };

type StoredUser = { email: string; hash?: string; password?: string };
type AuthResult = { ok: true } | { ok: false; error: string };

async function hash(email: string, password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${email}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users: StoredUser[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* ignore */ }
}
function setSession(email: string) {
  try { localStorage.setItem(SESSION_KEY, email); } catch { /* ignore */ }
}

export async function register(email: string, password: string): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return { ok: false, error: 'Bitte E-Mail und Passwort angeben.' };
  if (password.length < 8) return { ok: false, error: 'Das Passwort muss mindestens 8 Zeichen haben.' };
  const users = getUsers();
  if (normalized === TEST_ACCOUNT.email || users.some((u) => u.email === normalized)) {
    return { ok: false, error: 'Für diese E-Mail existiert bereits ein Konto.' };
  }
  saveUsers([...users, { email: normalized, hash: await hash(normalized, password) }]);
  setSession(normalized);
  return { ok: true };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const normalized = email.trim().toLowerCase();
  if (normalized === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
    setSession(normalized);
    return { ok: true };
  }
  const users = getUsers();
  const user = users.find((u) => u.email === normalized);
  const h = await hash(normalized, password);
  const legacyMatch = !!user && user.password !== undefined && user.password === password;
  if (!user || (user.hash !== h && !legacyMatch)) return { ok: false, error: 'E-Mail oder Passwort ist falsch.' };
  if (legacyMatch) saveUsers(users.map((u) => (u === user ? { email: u.email, hash: h } : u)));
  setSession(normalized);
  return { ok: true };
}

export function logout() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

export function getCurrentUser(): string | null {
  try { return localStorage.getItem(SESSION_KEY); } catch { return null; }
}
