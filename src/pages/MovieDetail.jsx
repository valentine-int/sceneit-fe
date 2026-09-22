import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import PopularReviews from '../components/review/PopularReviews';
import SimilarMovies from '../components/movie/SimilarMovies';
import ReviewCard from '../components/review/ReviewCard';
import ReviewModal from '../components/review/ReviewModal';

import {
  getMovieReviews,
  createMovieReview,
  likeReview,
  unlikeReview,
} from '../services/reviewService';

import {
  addToWatchlist,
  removeFromWatchlist,
} from '../services/watchlistService';

import {
  addToWatched,
  removeFromWatched,
} from '../services/watchedService';

import useMovieDetail from '../hooks/useMovieDetail';
import { getTmdbImage } from '../utils/tmdbImages';

function MovieDetail() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useMovieDetail(id, 'movie');

  // Movie action state
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [likedReviews, setLikedReviews] = useState([]);
  const [processingLikes, setProcessingLikes] = useState([]);

  // Load reviews for this movie
  useEffect(() => {
    async function loadReviews() {
      if (!data?.id) {
        setReviews([]);
        return;
      }

      try {
        setReviewsLoading(true);
        setReviewsError('');

        const result = await getMovieReviews(data.id);

        setReviews(result.reviews || []);
      } catch (error) {
        console.error('REVIEWS LOAD ERROR:', error);

        setReviews([]);
        setReviewsError(
          error.message || 'Failed to load reviews.'
        );
      } finally {
        setReviewsLoading(false);
      }
    }

    loadReviews();
  }, [data]);

  // Format backend createdAt for display
  const formatReviewDate = (date) => {
    if (!date) {
      return 'N/A';
    }

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

  // Add or remove movie from watchlist
  const handleWatchlist = async () => {
    if (!data?.id) {
      return;
    }

    try {
      if (isWatchlisted) {
        await removeFromWatchlist(data.id);
        setIsWatchlisted(false);
      } else {
        await addToWatchlist(data.id);
        setIsWatchlisted(true);
      }
    } catch (error) {
      console.error('WATCHLIST ERROR:', error);
    }
  };

  // Add or remove movie from watched
  const handleWatched = async () => {
    if (!data?.id) {
      return;
    }

    try {
      if (isWatched) {
        await removeFromWatched(data.id);
        setIsWatched(false);
      } else {
        await addToWatched(data.id);
        setIsWatched(true);
        setIsWatchlisted(false);
      }
    } catch (error) {
      console.error('WATCHED ERROR:', error);
    }
  };

  // Like or unlike a review
  const handleReviewLike = async (reviewId) => {
    if (processingLikes.includes(reviewId)) {
      return;
    }

    const isCurrentlyLiked =
      likedReviews.includes(reviewId);

    try {
      setProcessingLikes((current) => [
        ...current,
        reviewId,
      ]);

      if (isCurrentlyLiked) {
        await unlikeReview(reviewId);

        setLikedReviews((currentLikedReviews) =>
          currentLikedReviews.filter(
            (id) => id !== reviewId
          )
        );

        setReviews((currentReviews) =>
          currentReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  likeCount: Math.max(
                    (review.likeCount || 0) - 1,
                    0
                  ),
                }
              : review
          )
        );

        return;
      }

      await likeReview(reviewId);

      setLikedReviews((currentLikedReviews) => [
        ...currentLikedReviews,
        reviewId,
      ]);

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likeCount:
                  (review.likeCount || 0) + 1,
              }
            : review
        )
      );
    } catch (error) {
      console.error('REVIEW LIKE ERROR:', error);
    } finally {
      setProcessingLikes((current) =>
        current.filter((id) => id !== reviewId)
      );
    }
  };

  // Create review and optionally like the new review
  const handleReviewPublished = async (newReview) => {
    if (!data?.id) {
      throw new Error('Movie data is not available.');
    }

    const result = await createMovieReview(data.id, {
      rating: newReview.rating,
      content: newReview.reviewText,
      containsSpoiler: newReview.containsSpoiler,
    });

    const createdReview = result.review;

    // Like the newly created review if requested
    if (newReview.liked) {
      try {
        await likeReview(createdReview.id);

        setLikedReviews((currentLikedReviews) => [
          ...currentLikedReviews,
          createdReview.id,
        ]);
      } catch (error) {
        console.error('REVIEW LIKE ERROR:', error);
      }
    }

    // Reload reviews so the new review appears immediately
    const updatedResult = await getMovieReviews(data.id);

    setReviews(updatedResult.reviews || []);

    // Writing a review means the title has been watched
    setIsWatched(true);

    // A watched title is removed from the watchlist by backend
    setIsWatchlisted(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">
        <section className="container mx-auto px-6 pb-20 pt-32">

          <div className="py-20 text-center">

            <i className="ri-loader-4-line animate-spin text-3xl text-[#93939A]"></i>

            <p className="mt-4 text-sm text-[#93939A]">
              Loading movie details...
            </p>

          </div>

        </section>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">
        <section className="container mx-auto px-6 pb-20 pt-32">

          <div className="py-20 text-center">

            <i className="ri-error-warning-line text-3xl text-[#52525B]"></i>

            <h1 className="mt-4 text-xl font-semibold">
              Could not load this movie
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              {error?.message ||
                'Movie data is not available.'}
            </p>

          </div>

        </section>
      </main>
    );
  }

  const movie = {
    title: data.title,
    year: data.releaseYear,
    type:
      data.type === 'series'
        ? 'Series'
        : 'Movie',
    genre: data.genres,
    duration: data.duration
      ? `${Math.floor(data.duration / 60)}h ${data.duration % 60}m`
      : 'N/A',
    director: data.director,
    country: data.country,
    rating: data.rating
      ? Number(data.rating).toFixed(1)
      : 'N/A',
    backdrop: getTmdbImage(
      data.backdropPath,
      'original'
    ),
    poster: getTmdbImage(
      data.posterPath,
      'w500'
    ),
    description:
      data.overview ||
      'No description available.',
  };

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* Backdrop */}

      <section className="relative h-[420px] overflow-hidden">

        {movie.backdrop && (
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/70 to-[#090A0F]/10" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F]/70 to-transparent" />

      </section>

      {/* Movie information */}

      <section className="container mx-auto px-6">

        <div className="-mt-24 relative z-10 max-w-4xl">

          <div>

            <Badge>
              {movie.type}
            </Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            <p className="mt-1 text-sm text-[#93939A]">
              {movie.genre || 'Unknown genre'}
            </p>

          </div>

          {/* Movie actions */}

          <div className="mt-4 flex flex-wrap items-center gap-4">

            {/* Watchlist */}

            <button
              type="button"
              onClick={handleWatchlist}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isWatchlisted
                  ? 'text-[#F4F4F5]'
                  : 'text-[#93939A] hover:text-[#F4F4F5]'
              }`}
            >

              <i
                className={`${
                  isWatchlisted
                    ? 'ri-bookmark-fill'
                    : 'ri-bookmark-line'
                } text-lg`}
              ></i>

              <span>
                Watchlist
              </span>

            </button>

            {/* Watched */}

            <button
              type="button"
              onClick={handleWatched}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isWatched
                  ? 'text-[#F4F4F5]'
                  : 'text-[#93939A] hover:text-[#F4F4F5]'
              }`}
            >

              <i
                className={`${
                  isWatched
                    ? 'ri-checkbox-circle-fill'
                    : 'ri-check-line'
                } text-lg`}
              ></i>

              <span>
                Watched
              </span>

            </button>

            {/* Movie like */}

            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-colors ${
                isLiked
                  ? 'text-red-400'
                  : 'text-[#93939A] hover:text-[#F4F4F5]'
              }`}
              aria-label="Like movie"
            >

              <i
                className={`${
                  isLiked
                    ? 'ri-heart-fill'
                    : 'ri-heart-line'
                } text-xl`}
              ></i>

            </button>

            {/* Review */}

            <Button
              onClick={() => setIsReviewOpen(true)}
            >
              <i className="ri-add-line text-base"></i>
              Review
            </Button>

          </div>

          {/* Metadata */}

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">

            <span className="text-[#D4D4D8]">
              {movie.year || 'N/A'}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {movie.duration}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <div className="flex items-center gap-1.5">

              <i className="ri-star-fill text-yellow-400"></i>

              <span className="font-semibold text-[#F4F4F5]">
                {movie.rating}
              </span>

            </div>

            {movie.country && (
              <>
                <span className="text-[#52525B]">
                  •
                </span>

                <span className="text-[#D4D4D8]">
                  {movie.country}
                </span>
              </>
            )}

          </div>

          {/* Director */}

          {movie.director && (
            <p className="mt-3 text-sm text-[#93939A]">
              Director:{' '}

              <span className="text-[#D4D4D8]">
                {movie.director}
              </span>

            </p>
          )}

          {/* Description */}

          <div className="mt-4 max-w-2xl">

            <p className="text-sm leading-7 text-[#D4D4D8] sm:text-base">
              {movie.description}
            </p>

          </div>

        </div>

      </section>

      {/* Community reviews */}

      <section className="container mx-auto px-6 pb-16 pt-14">

        <div className="mb-6">

          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Community Reviews
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            What people think
          </h2>

        </div>

        {reviewsLoading && (
          <div className="py-10 text-center">

            <i className="ri-loader-4-line animate-spin text-2xl text-[#93939A]"></i>

            <p className="mt-3 text-sm text-[#93939A]">
              Loading reviews...
            </p>

          </div>
        )}

        {!reviewsLoading && reviewsError && (
          <div className="border-t border-[#27272A] py-8">

            <div className="flex items-center gap-2 text-sm text-[#93939A]">

              <i className="ri-error-warning-line"></i>

              <span>
                {reviewsError}
              </span>

            </div>

          </div>
        )}

        {!reviewsLoading &&
          !reviewsError &&
          reviews.length === 0 && (
            <div className="border-t border-[#27272A] py-10">

              <p className="text-sm text-[#93939A]">
                No reviews yet. Be the first to review this title.
              </p>

            </div>
          )}

        {!reviewsLoading &&
          !reviewsError &&
          reviews.length > 0 && (
            <div className="max-w-3xl">

              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-t border-[#27272A] py-6"
                >

                  <ReviewCard
                    username={
                      review.user?.name || 'User'
                    }
                    avatar={
                      review.user?.avatarUrl
                    }
                    poster={movie.poster}
                    rating={review.rating}
                    date={formatReviewDate(
                      review.createdAt
                    )}
                    review={review.content}
                    likes={review.likeCount || 0}
                    isLiked={likedReviews.includes(
                      review.id
                    )}
                    isProcessing={processingLikes.includes(
                      review.id
                    )}
                    onLike={() =>
                      handleReviewLike(review.id)
                    }
                    showPoster={false}
                  />

                  {review.containsSpoiler && (
                    <p className="mt-3 text-xs text-[#93939A]">
                      <i className="ri-alert-line mr-1"></i>
                      Contains spoilers
                    </p>
                  )}

                </div>
              ))}

            </div>
          )}

      </section>

      {/* Popular reviews */}

      <PopularReviews compact />

      {/* Similar movies */}

      <SimilarMovies />

      {/* Review modal */}

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onPublish={handleReviewPublished}
        movie={{
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          poster: movie.poster,
        }}
      />

    </main>
  );
}

export default MovieDetail;