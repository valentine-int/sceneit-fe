import { apiRequest } from './api';

export function getNotifications() {
  return apiRequest('/api/notifications');
}

export function markNotificationRead(notificationId) {
  return apiRequest(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export function markAllNotificationsRead() {
  return apiRequest('/api/notifications/read-all', {
    method: 'PATCH',
  });
}