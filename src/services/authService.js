import { apiRequest } from './api';

export function registerUser(data) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function loginUser(data) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logoutUser() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser() {
  return apiRequest('/api/auth/me');
}