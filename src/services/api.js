// Production build (Vercel): always use relative /api/* paths → goes through Vercel proxy
// → Railway. Cookie is set on sceneit-fe.vercel.app (same domain) → Safari ITP safe.
// Local dev: use VITE_API_URL=http://localhost:4000 → direct to local BE.
const API_BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || '');

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // kept for browsers that still rely on cookies
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed.');
  }

  return response.json();
}