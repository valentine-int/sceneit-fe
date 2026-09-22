import { apiRequest } from './api';

export function getWatchlist() {
  return apiRequest('/api/watchlist');
}

export function addToWatchlist(movieId) {
  return apiRequest(`/api/watchlist/${movieId}`, {
    method: 'POST',
  });
}

export function removeFromWatchlist(movieId) {
  return apiRequest(`/api/watchlist/${movieId}`, {
    method: 'DELETE',
  });
}
