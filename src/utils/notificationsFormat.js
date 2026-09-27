export function formatNotificationText(notification) {
  const name = notification.sourceUser?.name || 'Someone';
  if (notification.type === 'follow') {
    return `${name} started following you.`;
  }
  if (notification.type === 'like') {
    return `${name} liked your review.`;
  }
  return `${name} did something.`;
}

export function formatTimeAgo(date) {
  if (!date) return '';
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}