import { apiRequest } from './api';

// Reports
export function getReports() {
  return apiRequest('/api/admin/reports');
}
export function updateReportStatus(reportId, status) {
  return apiRequest(`/api/admin/reports/${reportId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// Users
export function getUsers() {
  return apiRequest('/api/admin/users');
}
export function deactivateUser(userId) {
  return apiRequest(`/api/admin/users/${userId}/deactivate`, {
    method: 'PATCH',
  });
}

// Featured
export function getFeaturedList() {
  return apiRequest('/api/featured'); // endpoint publik, tapi dipakai admin juga untuk lihat daftar
}
export function createFeatured(data) {
  return apiRequest('/api/admin/featured', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export function updateFeatured(id, data) {
  return apiRequest(`/api/admin/featured/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
export function removeFeatured(id) {
  return apiRequest(`/api/admin/featured/${id}`, {
    method: 'DELETE',
  });
}