import { apiRequest } from './api';

export function getFeed() {
  return apiRequest('/api/feed');
}