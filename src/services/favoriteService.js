import { apiRequest } from './api';

export function getFavorites() {
  return apiRequest('/api/favorites');
}

export function addToFavorites(movieId) {
  return apiRequest(`/api/favorites/${movieId}`, {
    method: 'POST',
  });
}

export function removeFromFavorites(movieId) {
  return apiRequest(`/api/favorites/${movieId}`, {
    method: 'DELETE',
  });
}