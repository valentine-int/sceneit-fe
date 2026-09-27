import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notificationService';
import { formatNotificationText, formatTimeAgo } from '../utils/notificationsFormat';
import profile from '../assets/profile.jpg';

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        setError('');
        const result = await getNotifications();
        setNotifications(result.notifications || []);
      } catch (err) {
        console.error('NOTIFICATIONS PAGE LOAD ERROR:', err);
        setError(err.message || 'Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const handleClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item
          )
        );
      } catch (err) {
        console.error('MARK READ ERROR:', err);
      }
    }
    if (notification.type === 'like' && notification.reviewId) {
      navigate('/me/reviews');
    }
    if (notification.type === 'follow' && notification.sourceUser?.id) {
      navigate(`/profile/${notification.sourceUser.id}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      console.error('MARK ALL READ ERROR:', err);
    }
  };

  return (
    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
      <section className="container mx-auto max-w-2xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              Inbox
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-sm text-[#93939A] transition-colors hover:text-[#F4F4F5]"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading && (
          <div className="py-16 text-center text-sm text-[#93939A]">
            <i className="ri-loader-4-line animate-spin mr-2"></i>
            Loading notifications...
          </div>
        )}

        {!loading && error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="py-16 text-center">
            <i className="ri-notification-off-line text-3xl text-[#52525B]"></i>
            <p className="mt-3 text-sm text-[#93939A]">You're all caught up. No notifications yet.</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="flex flex-col gap-1 rounded-xl border border-[#27272A] bg-[#12141C] p-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleClick(notification)}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-[#1A1C24] ${
                  !notification.isRead ? 'bg-[#1A1C24]/50' : ''
                }`}
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#090A0F]">
                  <img
                    src={notification.sourceUser?.avatarUrl || profile}
                    alt={notification.sourceUser?.name || 'User'}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-[#D4D4D8]">
                    {formatNotificationText(notification)}
                  </p>
                  <p className="mt-1 text-xs text-[#93939A]">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#F4F4F5]"></span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default NotificationsPage;