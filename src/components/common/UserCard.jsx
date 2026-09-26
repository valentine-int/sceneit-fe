import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';
import profile from '../../assets/profile.jpg';

function UserCard({ user, onFollowChange }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#27272A] bg-[#12141C] p-4">
      <Link to={`/profile/${user.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[#090A0F]">
          <img
            src={user.avatarUrl || profile}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#F4F4F5]">{user.name}</p>
          {user.bio && (
            <p className="truncate text-xs text-[#93939A]">{user.bio}</p>
          )}
        </div>
      </Link>
      <FollowButton
        userId={user.id}
        initialIsFollowing={user.isFollowing}
        onChange={(nextIsFollowing) => onFollowChange?.(user.id, nextIsFollowing)}
      />
    </div>
  );
}

export default UserCard;