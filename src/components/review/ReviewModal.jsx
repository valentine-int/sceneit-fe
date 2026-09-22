import React from 'react';
import 'remixicon/fonts/remixicon.css';

import dummyPoster from '../../assets/Poster1.jpg';

function ReviewModal({
  isOpen,
  onClose,
  onPublish,
  movie,
}) {
  const [rating, setRating] = React.useState(0);
  const [reviewText, setReviewText] = React.useState('');
  const [liked, setLiked] = React.useState(false);
  const [containsSpoiler, setContainsSpoiler] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handlePublish = async () => {
    if (rating === 0) {
      setErrorMessage('Please give this film a rating.');
      return;
    }

    if (reviewText.trim() === '') {
      setErrorMessage('Please write your review.');
      return;
    }

    try {
      setErrorMessage('');
      setIsPublishing(true);

      await onPublish({
        rating,
        reviewText: reviewText.trim(),
        liked,
        containsSpoiler,
      });
    } catch (error) {
      setErrorMessage(
        error.message ||
          'Failed to publish your review.'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="relative w-full max-w-3xl rounded-2xl bg-[#F4F4F5] p-6 text-[#090A0F] shadow-2xl">

        <button
          type="button"
          onClick={onClose}
          disabled={isPublishing}
          className="absolute right-5 top-5 text-[#71717A] transition-colors hover:text-[#090A0F] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close review modal"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        <div className="pr-10">

          <h2 className="text-2xl font-bold">
            Write a Review
          </h2>

          <p className="mt-1 text-sm text-[#71717A]">
            Share your thoughts about this film.
          </p>

        </div>

        <div className="mt-6 flex gap-4">

          <div className="w-20 flex-shrink-0">

            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#E4E4E7]">

              <img
                src={movie?.poster || dummyPoster}
                alt={movie?.title || 'Movie'}
                className="h-full w-full object-cover"
              />

            </div>

          </div>

          <div className="min-w-0 flex-1">

            <h3 className="text-lg font-bold">

              {movie?.title || 'Movie'}{' '}

              <span className="font-normal text-[#71717A]">
                ({movie?.year || 'N/A'})
              </span>

            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              {movie?.genre || 'Film'}
            </p>

            <button
              type="button"
              onClick={() => setLiked(!liked)}
              disabled={isPublishing}
              className={`mt-3 flex items-center gap-1.5 py-1 text-xs transition-colors ${
                liked
                  ? 'text-[#090A0F]'
                  : 'text-[#71717A] hover:text-[#090A0F]'
              }`}
            >

              <i
                className={`${
                  liked
                    ? 'ri-heart-fill'
                    : 'ri-heart-line'
                } text-sm`}
              ></i>

              <span>Like</span>

            </button>

            <div className="mt-2 flex items-center gap-0.5">

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setErrorMessage('');
                  }}
                  disabled={isPublishing}
                  className="p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed"
                  aria-label={`Rate ${star} out of 5`}
                >

                  <i
                    className={`${
                      star <= rating
                        ? 'ri-star-fill text-yellow-400'
                        : 'ri-star-line text-[#A1A1AA]'
                    } text-xl`}
                  ></i>

                </button>
              ))}

            </div>

          </div>

        </div>

        <div className="mt-5 w-full">

          <textarea
            rows="5"
            value={reviewText}
            onChange={(event) => {
              setReviewText(event.target.value);
              setErrorMessage('');
            }}
            disabled={isPublishing}
            placeholder="Write your thoughts about this film..."
            className="block w-full resize-none rounded-xl border border-[#D4D4D8] bg-white p-4 text-sm leading-6 text-[#090A0F] outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-[#090A0F] disabled:cursor-not-allowed disabled:bg-[#F4F4F5]"
          />

        </div>

        {errorMessage && (
          <p className="mt-3 text-xs text-red-500">
            {errorMessage}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[#E4E4E7] pt-4">

          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#71717A] transition-colors hover:text-[#090A0F]">

            <input
              type="checkbox"
              checked={containsSpoiler}
              onChange={(event) =>
                setContainsSpoiler(
                  event.target.checked
                )
              }
              disabled={isPublishing}
              className="h-4 w-4 cursor-pointer rounded border-[#D4D4D8] accent-[#090A0F]"
            />

            <span>
              Contains spoilers
            </span>

          </label>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="rounded-xl bg-[#090A0F] px-5 py-2 text-sm font-semibold text-[#F4F4F5] shadow-sm transition-colors hover:bg-[#27272A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPublishing
              ? 'Publishing...'
              : 'Publish'}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReviewModal;