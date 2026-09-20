import React from 'react';
import 'remixicon/fonts/remixicon.css';

function ReviewCard({
  username,
  avatar,
  poster,
  rating,
  date,
  review,
  likes,
  showPoster = true
}) {
  return (
    <article className="flex gap-4 sm:gap-5 rounded-xl border border-[#27272A] bg-[#12141C] p-4 sm:p-5">

      {/* Poster */}
      {showPoster && (
        <div className="w-20 sm:w-24 flex-shrink-0">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#090A0F]">
            <img
              src={poster}
              alt="Movie poster"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Review Content */}
      <div className="min-w-0 flex-1">

        {/* User + Rating */}
        <div className="flex items-start justify-between gap-4">

          {/* User */}
          <div className="flex items-center gap-3 min-w-0">

            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#090A0F] flex-shrink-0">
              <img
                src={avatar}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F4F4F5] truncate">
                {username}
              </p>

              <p className="text-xs text-[#93939A]">
                {date}
              </p>
            </div>

          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <i className="ri-star-fill text-xs text-yellow-400"></i>

            <span className="text-sm font-semibold text-[#F4F4F5]">
              {rating}
            </span>
          </div>

        </div>

        {/* Review Text */}
        <p className="mt-4 text-sm leading-relaxed text-[#D4D4D8]">
          "{review}"
        </p>

        {/* Like */}
        <button className="mt-5 flex items-center gap-1.5 text-xs text-[#93939A] hover:text-[#F4F4F5] transition-colors">
          <i className="ri-heart-line text-base"></i>
          <span>{likes}</span>
        </button>

      </div>

    </article>
  );
}

export default ReviewCard;