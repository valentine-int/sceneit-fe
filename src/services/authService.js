import { apiRequest } from './api';

export async function registerUser(data) {
  const result = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  // Register auto-login: persist token so subsequent requests use header auth
  if (result.token) {
    localStorage.setItem('token', result.token);
  }
  return result;
}

export async function loginUser(data) {
  const result = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (result.token) {
    localStorage.setItem('token', result.token);
  }
  return result;
}

export async function logoutUser() {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } finally {
    // Always clear token regardless of whether the API call succeeds,
    // so the user is never stuck in a broken "logged-in" state.
    localStorage.removeItem('token');
  }
}

export function getCurrentUser() {
  return apiRequest('/api/auth/me');
}

export function updateProfile(data) {
  return apiRequest('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}