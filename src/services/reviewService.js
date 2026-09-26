import { apiRequest } from './api';

export function getMovieReviews(movieId) {
  return apiRequest(`/api/movies/${movieId}/reviews`);
}

export function getMyReviews() {
  return apiRequest('/api/reviews/me');
}

export function createMovieReview(movieId, data) {
  return apiRequest(`/api/movies/${movieId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateReview(reviewId, data) {
  return apiRequest(`/api/reviews/${reviewId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteReview(reviewId) {
  return apiRequest(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}

export function likeReview(reviewId) {
  return apiRequest(`/api/reviews/${reviewId}/like`, {
    method: 'POST',
  });
}

export function unlikeReview(reviewId) {
  return apiRequest(`/api/reviews/${reviewId}/like`, {
    method: 'DELETE',
  });
}

export function getPopularReviews(limit = 10) {
  return apiRequest(`/api/reviews/popular?limit=${limit}`);
}

export function reportReview(reviewId, reason) {
  return apiRequest(`/api/reviews/${reviewId}/report`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}