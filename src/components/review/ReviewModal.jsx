import React from 'react';
import 'remixicon/fonts/remixicon.css';

import dummyPoster from '../../assets/Poster1.jpg';

import {
  getReviews,
  saveReviews,
} from '../../utils/sceneitStorage';

function ReviewModal({
  isOpen,
  onClose,
  movie,
  onPublish,
}) {
  const [rating, setRating] = React.useState(0);
  const [reviewDate, setReviewDate] = React.useState('');
  const [reviewText, setReviewText] = React.useState('');
  const [liked, setLiked] = React.useState(false);
  const [containsSpoiler, setContainsSpoiler] =
    React.useState(false);
  const [errorMessage, setErrorMessage] =
    React.useState('');

  const dateInputRef = React.useRef(null);

  // =========================
  // RESET WHEN MODAL OPENS
  // =========================

  React.useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReviewDate(
        new Date().toISOString().split('T')[0]
      );
      setReviewText('');
      setLiked(false);
      setContainsSpoiler(false);
      setErrorMessage('');
    }
  }, [isOpen, movie?.id]);

  // =========================
  // OPEN DATE PICKER
  // =========================

  const openDatePicker = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker();
    } else {
      dateInputRef.current?.focus();
    }
  };

  // =========================
  // PUBLISH REVIEW
  // =========================

  const handlePublish = () => {

    if (!reviewDate) {
      setErrorMessage(
        'Please select a review date.'
      );
      return;
    }

    if (rating === 0) {
      setErrorMessage(
        'Please give this title a rating.'
      );
      return;
    }

    if (reviewText.trim() === '') {
      setErrorMessage(
        'Please write your review.'
      );
      return;
    }

    setErrorMessage('');

    // =========================
    // CREATE REVIEW
    // =========================

    const newReview = {
      id: Date.now(),

      movieId: movie.id,

      title: movie.title,

      type: movie.type,

      rating,

      reviewDate,

      reviewText: reviewText.trim(),

      liked,

      containsSpoiler,

      poster: movie.poster || null,
    };

    // =========================
    // GET EXISTING REVIEWS
    // =========================

    const savedReviews = getReviews();

    // =========================
    // SAVE NEW REVIEW
    // =========================

    const updatedReviews = [
      newReview,
      ...savedReviews,
    ];

    saveReviews(updatedReviews);

    // =========================
    // SEND REVIEW TO PARENT
    // =========================

    if (onPublish) {
      onPublish(newReview);
    }

    // =========================
    // CLOSE MODAL
    // =========================

    onClose();
  };

  if (!isOpen || !movie) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="relative w-full max-w-3xl rounded-2xl bg-[#F4F4F5] p-6 text-[#090A0F] shadow-2xl">

        {/* =========================
            CLOSE
        ========================= */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-[#71717A] transition-colors hover:text-[#090A0F]"
          aria-label="Close review modal"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>

        {/* =========================
            HEADER
        ========================= */}

        <div className="pr-10">

          <h2 className="text-2xl font-bold">
            Write a Review
          </h2>

          <p className="mt-1 text-sm text-[#71717A]">
            Share your thoughts about this title.
          </p>

        </div>

        {/* =========================
            TITLE INFO
        ========================= */}

        <div className="mt-6 flex gap-4">

          {/* POSTER */}

          <div className="w-20 flex-shrink-0">

            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#E4E4E7]">

              <img
                src={movie.poster || dummyPoster}
                alt={movie.title}
                className="h-full w-full object-cover"
              />

            </div>

          </div>

          {/* TITLE DETAILS */}

          <div className="min-w-0 flex-1">

            <h3 className="text-lg font-bold">

              {movie.title}{' '}

              <span className="font-normal text-[#71717A]">
                ({movie.year})
              </span>

            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              {movie.type}
            </p>

            {/* DATE + LIKE */}

            <div className="mt-2 flex flex-wrap items-center gap-2">

              <div className="flex items-center gap-1.5 py-1">

                <button
                  type="button"
                  onClick={openDatePicker}
                  className="flex items-center text-[#090A0F] transition-colors hover:text-[#71717A]"
                  aria-label="Change review date"
                >
                  <i className="ri-calendar-line text-sm"></i>
                </button>

                <input
                  ref={dateInputRef}
                  type="date"
                  value={reviewDate}
                  onChange={(event) => {
                    setReviewDate(
                      event.target.value
                    );
                    setErrorMessage('');
                  }}
                  className="w-[75px] cursor-pointer bg-transparent p-0 text-xs text-[#71717A] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
                />

              </div>

              <button
                type="button"
                onClick={() => {
                  setLiked(!liked);
                }}
                className={`flex items-center gap-1.5 py-1 text-xs transition-colors ${
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

                <span>
                  Like
                </span>

              </button>

            </div>

            {/* RATING */}

            <div className="mt-2 flex items-center gap-0.5">

              {[1, 2, 3, 4, 5].map((star) => (

                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setErrorMessage('');
                  }}
                  className="p-0.5 transition-transform hover:scale-110"
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

        {/* =========================
            REVIEW TEXT
        ========================= */}

        <div className="mt-5 w-full">

          <textarea
            rows="5"
            value={reviewText}
            onChange={(event) => {
              setReviewText(
                event.target.value
              );
              setErrorMessage('');
            }}
            placeholder="Write your thoughts about this title..."
            className="block w-full resize-none rounded-xl border border-[#D4D4D8] bg-white p-4 text-sm leading-6 text-[#090A0F] outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-[#090A0F]"
          />

        </div>

        {/* =========================
            ERROR
        ========================= */}

        {errorMessage && (
          <p className="mt-3 text-xs text-red-500">
            {errorMessage}
          </p>
        )}

        {/* =========================
            FOOTER
        ========================= */}

        <div className="mt-4 flex items-center justify-between border-t border-[#E4E4E7] pt-4">

          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#71717A] transition-colors hover:text-[#090A0F]">

            <input
              type="checkbox"
              checked={containsSpoiler}
              onChange={(event) => {
                setContainsSpoiler(
                  event.target.checked
                );
              }}
              className="h-4 w-4 cursor-pointer rounded border-[#D4D4D8] accent-[#090A0F]"
            />

            <span>
              Contains spoilers
            </span>

          </label>

          <button
            type="button"
            onClick={handlePublish}
            className="rounded-xl bg-[#090A0F] px-5 py-2 text-sm font-semibold text-[#F4F4F5] shadow-sm transition-colors hover:bg-[#27272A]"
          >
            Publish
          </button>

        </div>

      </div>

    </div>
  );
}

export default ReviewModal;