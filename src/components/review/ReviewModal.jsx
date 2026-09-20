import React from 'react';
import 'remixicon/fonts/remixicon.css';

import dummyPoster from '../../assets/Poster1.jpg';

function ReviewModal({ isOpen, onClose }) {
  const [rating, setRating] = React.useState(0);
  const [reviewDate, setReviewDate] = React.useState('2026-09-13');
  const [watched, setWatched] = React.useState(true);
  const [reviewText, setReviewText] = React.useState('');
  const [containsSpoiler, setContainsSpoiler] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const dateInputRef = React.useRef(null);

  const openDatePicker = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker();
    } else {
      dateInputRef.current?.focus();
    }
  };

  const handlePublish = () => {
    if (!reviewDate) {
        setErrorMessage('Please select a review date.');
        return;
    }
  
  if (rating === 0) {
    setErrorMessage('Please give this film a rating.');
    return;
  }

  if (reviewText.trim() === '') {
    setErrorMessage('Please write your review.');
    return;
  }

  setErrorMessage('');
  onClose();
};


  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="relative w-full max-w-3xl rounded-2xl bg-[#F4F4F5] p-6 text-[#090A0F] shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#71717A] transition-colors hover:text-[#090A0F]"
          aria-label="Close review modal"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>


        {/* Header */}
        <div className="pr-10">
          <h2 className="text-2xl font-bold">
            Write a Review
          </h2>

          <p className="mt-1 text-sm text-[#71717A]">
            Share your thoughts about this film.
          </p>
        </div>


        {/* Movie Information */}
        <div className="mt-6 flex gap-4">

          {/* Poster */}
          <div className="w-20 flex-shrink-0">
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[#E4E4E7]">
              <img
                src={dummyPoster}
                alt="The Call"
                className="h-full w-full object-cover"
              />
            </div>
          </div>


          {/* Movie Details */}
          <div className="min-w-0 flex-1">

            {/* Title */}
            <h3 className="text-lg font-bold">
              The Call{' '}
              <span className="font-normal text-[#71717A]">
                (2020)
              </span>
            </h3>


            {/* Genre */}
            <p className="mt-1 text-sm text-[#71717A]">
              Thriller
            </p>


            {/* Date + Watched */}
            <div className="mt-2 flex flex-wrap items-center gap-1">

              {/* Review Date */}
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
                  onChange={(e) => {setReviewDate(e.target.value)
                    setErrorMessage('');}
                  }
                  className="w-[75px] cursor-pointer bg-transparent p-0 text-xs text-[#71717A] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
                />

              </div>


              {/* Watched */}
              <button
                type="button"
                onClick={() => setWatched(!watched)}
                className={`flex items-center gap-1.5 py-1 text-xs transition-colors ${
                  watched
                    ? 'text-[#090A0F]'
                    : 'text-[#A1A1AA] hover:text-[#090A0F]'
                }`}
              >
                <i
                  className={`${
                    watched
                      ? 'ri-checkbox-circle-fill text-[#090A0F]'
                      : 'ri-checkbox-blank-circle-line'
                  } text-sm`}
                ></i>

                <span>Watched</span>
              </button>

            </div>


            {/* Rating */}
            <div className="mt-2 flex items-center gap-0.5">

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {setRating(star)
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


        {/* Review Text */}
        <div className="mt-5 w-full">

          <textarea
            rows="5"
            value={reviewText}
            onChange={(e) => {
                setReviewText(e.target.value)
                setErrorMessage('');
            }}
            placeholder="Write your thoughts about this film..."
            className="block w-full resize-none rounded-xl border border-[#D4D4D8] bg-white p-4 text-sm leading-6 text-[#090A0F] outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-[#090A0F]"
          />

        </div>

        {errorMessage && (
            <p className="mt-3 text-xs text-red-500">
                {errorMessage}
                </p>
            )
            }


        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-[#E4E4E7] pt-4">

          {/* Spoiler Checkbox */}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#71717A] transition-colors hover:text-[#090A0F]">

            <input
              type="checkbox"
              checked={containsSpoiler}
              onChange={(e) => setContainsSpoiler(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-[#D4D4D8] accent-[#090A0F]"
            />

            <span>
              Contains spoilers
            </span>

          </label>


          {/* Publish */}
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