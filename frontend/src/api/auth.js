const TOKEN_KEY = 'admin_token';

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function isAuthed() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
