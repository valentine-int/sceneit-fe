import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import ReviewCard from '../../components/review/ReviewCard';
import { getReviews } from '../../utils/sceneitStorage';

import profile from '../../assets/profile.jpg';
import dummyPoster from '../../assets/Poster1.jpg';

function MyReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const savedReviews = getReviews();

    setReviews(savedReviews);
  }, []);

  const formatReviewDate = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* =========================
          HEADER
      ========================= */}

      <section className="container mx-auto px-6 pb-8 pt-32">

        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#93939A] transition-colors hover:text-[#F4F4F5]"
        >
          <i className="ri-arrow-left-s-line text-lg"></i>
          Profile
        </Link>

        <div className="flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              From your activity
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Reviews
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
              Reviews you have written for movies and series.
            </p>

          </div>

          <span className="hidden text-sm text-[#93939A] sm:block">
            {reviews.length} reviews
          </span>

        </div>

      </section>

      {/* =========================
          REVIEWS
      ========================= */}

      <section className="container mx-auto px-6 pb-20">

        {reviews.length > 0 ? (

          <div className="flex flex-col gap-8">

            {reviews.map((review) => (

              <article
                key={review.id}
                className="border-t border-[#27272A] pt-6"
              >

                {/* MOVIE / SERIES INFO */}

                <div className="mb-4 flex items-center justify-between gap-4">

                  <div className="min-w-0">

                    <h2 className="truncate text-base font-semibold text-[#F4F4F5] sm:text-lg">
                      {review.title}
                    </h2>

                    <p className="mt-1 text-xs text-[#93939A]">
                      {review.type}
                    </p>

                  </div>

                  <Link
                    to={
                      review.type === 'Series'
                        ? `/series/${review.movieId}`
                        : `/movie/${review.movieId}`
                    }
                    className="flex-shrink-0 text-xs font-medium text-[#93939A] transition-colors hover:text-[#F4F4F5]"
                  >
                    View title
                    <i className="ri-arrow-right-s-line ml-1"></i>
                  </Link>

                </div>

                {/* REVIEW */}

                <ReviewCard
                  username="Feby Valentine Samosir"
                  avatar={profile}
                  poster={review.poster || dummyPoster}
                  rating={review.rating}
                  date={formatReviewDate(review.reviewDate)}
                  review={review.reviewText}
                  likes={0}
                  showPoster={true}
                />

                {/* REVIEW STATUS */}

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#93939A]">

                  {review.liked && (
                    <span className="flex items-center gap-1.5">
                      <i className="ri-heart-fill text-red-400"></i>
                      You liked this title
                    </span>
                  )}

                  {review.containsSpoiler && (
                    <span className="flex items-center gap-1.5">
                      <i className="ri-alert-line"></i>
                      Contains spoilers
                    </span>
                  )}

                </div>

              </article>

            ))}

          </div>

        ) : (

          /* =========================
             EMPTY STATE
          ========================= */

          <div className="py-20 text-center">

            <i className="ri-chat-quote-line text-3xl text-[#52525B]"></i>

            <h2 className="mt-4 text-lg font-semibold">
              No reviews yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              Write a review for a movie or series and it will appear here.
            </p>

            <Link
              to="/movies"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7]"
            >
              Browse Movies
              <i className="ri-arrow-right-s-line"></i>
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}

export default MyReviews;