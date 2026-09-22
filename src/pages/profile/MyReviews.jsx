import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import ReviewCard from '../../components/review/ReviewCard';
import { getMyReviews } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { getTmdbImage } from '../../utils/tmdbImages';

import profile from '../../assets/profile.jpg';
import dummyPoster from '../../assets/Poster1.jpg';

function MyReviews() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadMyReviews() {
      if (!user) {
        setReviews([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');

        const result = await getMyReviews();

        setReviews(result.reviews || []);
      } catch (error) {
        console.error('MY REVIEWS LOAD ERROR:', error);

        setErrorMessage(
          error.message || 'Failed to load your reviews.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMyReviews();
  }, [user]);

  const formatReviewDate = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'N/A';
    }

    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* HEADER */}

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

      {/* REVIEWS */}

      <section className="container mx-auto px-6 pb-20">

        {isLoading ? (

          <div className="py-20 text-center">

            <p className="text-sm text-[#93939A]">
              Loading your reviews...
            </p>

          </div>

        ) : errorMessage ? (

          <div className="py-20 text-center">

            <i className="ri-error-warning-line text-3xl text-[#52525B]"></i>

            <h2 className="mt-4 text-lg font-semibold">
              Could not load reviews
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              {errorMessage}
            </p>

          </div>

        ) : reviews.length > 0 ? (

          <div className="flex flex-col gap-8">

            {reviews.map((review) => {

              const movie = review.movie;

              const isSeries = movie?.type === 'series';

              const detailPath = isSeries
                ? `/series/${movie.tmdbId}`
                : `/movie/${movie.tmdbId}`;

              const poster = getTmdbImage(
                movie?.posterPath,
                'w500'
              );

              return (
                <article
                  key={review.id}
                  className="border-t border-[#27272A] pt-6"
                >

                  {/* MOVIE / SERIES INFO */}

                  <div className="mb-4 flex items-center justify-between gap-4">

                    <div className="min-w-0">

                      <h2 className="truncate text-base font-semibold text-[#F4F4F5] sm:text-lg">
                        {movie?.title || 'Unknown title'}
                      </h2>

                      <p className="mt-1 text-xs capitalize text-[#93939A]">
                        {movie?.type || 'Unknown'}
                      </p>

                    </div>

                    <Link
                      to={detailPath}
                      className="flex-shrink-0 text-xs font-medium text-[#93939A] transition-colors hover:text-[#F4F4F5]"
                    >
                      View title
                      <i className="ri-arrow-right-s-line ml-1"></i>
                    </Link>

                  </div>

                  {/* REVIEW */}

                  <ReviewCard
                    username={user?.name || 'You'}
                    avatar={
                      user?.avatarUrl ||
                      profile
                    }
                    poster={poster || dummyPoster}
                    rating={review.rating}
                    date={formatReviewDate(review.createdAt)}
                    review={review.content}
                    likes={review.likeCount || 0}
                    showPoster={true}
                  />

                  {/* REVIEW STATUS */}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#93939A]">

                    {review.containsSpoiler && (
                      <span className="flex items-center gap-1.5">
                        <i className="ri-alert-line"></i>
                        Contains spoilers
                      </span>
                    )}

                  </div>

                </article>
              );
            })}

          </div>

        ) : (

          /* EMPTY STATE */

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