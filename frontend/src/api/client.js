const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5136';
import { getToken } from './auth';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getCakes() {
  const res = await fetch(`${BASE_URL}/api/cakes`);
  return handleResponse(res);
}

export async function loginAdmin(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res);
}

export function getApiBaseUrl() {
  return BASE_URL;
}

export function toImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url}`;
}

// Auth header helper
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Admin: Cakes CRUD
export async function uploadImage(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/api/uploads`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  });
  return handleResponse(res);
}

export async function createCake(payload) {
  const res = await fetch(`${BASE_URL}/api/cakes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateCake(id, payload) {
  const res = await fetch(`${BASE_URL}/api/cakes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Update failed (${res.status})`);
  }
  return true;
}

export async function deleteCake(id) {
  const res = await fetch(`${BASE_URL}/api/cakes/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Delete failed (${res.status})`);
  }
  return true;
}

// Admin: Orders & Analytics
export async function getOrders() {
  const res = await fetch(`${BASE_URL}/api/orders`, { headers: { ...authHeaders() } });
  return handleResponse(res);
}

export async function getTopSelling(days = 30, top = 5) {
  const res = await fetch(`${BASE_URL}/api/analytics/top-selling?days=${days}&top=${top}`, { headers: { ...authHeaders() } });
  return handleResponse(res);
}

export async function getSalesSummary(days = 30) {
  const res = await fetch(`${BASE_URL}/api/analytics/sales-summary?days=${days}`, { headers: { ...authHeaders() } });
  return handleResponse(res);
}
