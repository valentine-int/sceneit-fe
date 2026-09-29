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
  const result = await apiRequest('/api/auth/logout', {
    method: 'POST',
  });
  localStorage.removeItem('token');
  return result;
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