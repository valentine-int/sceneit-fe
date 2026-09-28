import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';
import { formatNotificationText, formatTimeAgo } from '../../utils/notificationsFormat';
import profile from '../../assets/profile.jpg';

function NotificationBell() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  // Load notifications once user is known
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    loadNotifications();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError('');
      const result = await getNotifications();
      setNotifications(result.notifications || []);
    } catch (err) {
      console.error('NOTIFICATIONS LOAD ERROR:', err);
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  const handleNotificationClick = async (notification) => {
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
    setIsOpen(false);
    if (notification.type === 'like' && notification.reviewId) {
      navigate('/me/reviews');
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

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#27272A] text-[#93939A] transition-colors hover:text-[#F4F4F5]"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <i className="ri-notification-3-line text-lg"></i>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-16 z-50 overflow-hidden rounded-xl border border-[#27272A] bg-[#12141C] shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[360px]">
          <div className="flex items-center justify-between border-b border-[#27272A] px-4 py-3">
            <p className="text-sm font-semibold text-[#F4F4F5]">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs text-[#93939A] transition-colors hover:text-[#F4F4F5]"
              >
                Mark all as read
              </button>
            )}
          </div>

          <Link
          to="/notifications"
          onClick={() => setIsOpen(false)}
          className="block border-t border-[#27272A] px-4 py-3 text-center text-sm text-[#93939A] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
          >
          See all notifications
          </Link>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-[#93939A]">
                <i className="ri-loader-4-line animate-spin text-base"></i>
                <span>Loading...</span>
              </div>
            )}

            {!loading && error && (
              <div className="px-4 py-6 text-center text-sm text-[#93939A]">{error}</div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="px-4 py-8 text-center">
                <i className="ri-notification-off-line text-2xl text-[#52525B]"></i>
                <p className="mt-2 text-sm text-[#93939A]">No notifications yet.</p>
              </div>
            )}

            {!loading &&
              !error &&
              notifications.length > 0 &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#1A1C24] ${
                    !notification.isRead ? 'bg-[#1A1C24]/50' : ''
                  }`}
                >
                  <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-[#090A0F]">
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
        </div>
      )}
    </div>
  );
}

export default NotificationBell;