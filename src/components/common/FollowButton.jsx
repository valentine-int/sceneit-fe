import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { followUser, unfollowUser } from '../../services/socialService';
import Button from './Button';

function FollowButton({ userId, initialIsFollowing = false, onChange }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleFollow = async () => {
    if (!userId || loading) return;
    try {
      setLoading(true);
      setError('');
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        onChange?.(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
        onChange?.(true);
      }
    } catch (err) {
      console.error('FOLLOW ERROR:', err);
      setError(err.message || 'Failed to update follow status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant={isFollowing ? 'ghost' : 'primary'}
        onClick={handleToggleFollow}
        className={loading ? 'cursor-not-allowed opacity-60' : ''}
      >
        <i
          className={`${
            isFollowing ? 'ri-user-unfollow-line' : 'ri-user-add-line'
          } text-base`}
        ></i>
        {loading ? 'Please wait...' : isFollowing ? 'Following' : 'Follow'}
      </Button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default FollowButton;