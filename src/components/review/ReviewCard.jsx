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
  isLiked = false,
  isProcessing = false,
  onLike,
  showPoster = true,
  hideLike = false,
}) {
  return (
    <article className="flex gap-4 rounded-xl border border-[#27272A] bg-[#12141C] p-4 sm:gap-5 sm:p-5">

      {/* Poster */}

      {showPoster && (
        <div className="w-20 flex-shrink-0 sm:w-24">

          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#090A0F]">

            <img
              src={poster}
              alt="Movie poster"
              className="h-full w-full object-cover"
            />

          </div>

        </div>
      )}

      {/* Review content */}

      <div className="min-w-0 flex-1">

        {/* User + rating */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-[#090A0F]">

              {avatar ? (
                <img
                  src={avatar}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#93939A]">
                  {(username || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-[#F4F4F5]">
                {username}
              </p>

              <p className="text-xs text-[#93939A]">
                {date}
              </p>

            </div>

          </div>

          {/* Rating */}

          <div className="flex flex-shrink-0 items-center gap-1.5">

            <i className="ri-star-fill text-xs text-yellow-400"></i>

            <span className="text-sm font-semibold text-[#F4F4F5]">
              {rating}
            </span>

          </div>

        </div>

        {/* Review text */}

        <p className="mt-4 text-sm leading-relaxed text-[#D4D4D8]">
          "{review}"
        </p>

        {/* Like */}
        {!hideLike && (
          <button
            type="button"
            onClick={onLike}
            disabled={isProcessing}
            className={`mt-5 flex items-center gap-1.5 text-xs transition-colors ${
              isLiked ? 'text-red-400' : 'text-[#93939A] hover:text-[#F4F4F5]'
            } ${isProcessing ? 'cursor-not-allowed opacity-60' : ''}`}
            aria-label={isLiked ? 'Unlike review' : 'Like review'}
          >
            <i className={`${isLiked ? 'ri-heart-fill' : 'ri-heart-line'} text-base`}></i>
            <span>{likes}</span>
          </button>
        )}

      </div>

    </article>
  );
}

export default ReviewCard;

