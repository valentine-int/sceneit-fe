import { apiRequest } from './api';

export function followUser(userId) {
  return apiRequest(`/api/users/${userId}/follow`, {
    method: 'POST',
  });
}

export function unfollowUser(userId) {
  return apiRequest(`/api/users/${userId}/follow`, {
    method: 'DELETE',
  });
}

export function getFollowStatus(userId) {
  return apiRequest(`/api/users/${userId}/follow-status`);
}

export function getFollowers(userId) {
  return apiRequest(`/api/users/${userId}/followers`);
}

export function getFollowing(userId) {
  return apiRequest(`/api/users/${userId}/following`);
}

export function searchUsers(query) {
  const params = new URLSearchParams({ query });
  return apiRequest(`/api/users/search?${params.toString()}`);
}

export function getPublicUser(userId) {
  return apiRequest(`/api/users/${userId}`);
}