import { apiRequest } from './api';

export function getWatched() {
  return apiRequest('/api/watched');
}

export function addToWatched(movieId) {
  return apiRequest(`/api/watched/${movieId}`, {
    method: 'POST',
  });
}

export function removeFromWatched(movieId) {
  return apiRequest(`/api/watched/${movieId}`, {
    method: 'DELETE',
  });
}