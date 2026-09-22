import React, { useEffect, useState } from 'react';

import 'remixicon/fonts/remixicon.css';

import { useParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { getTmdbImage } from '../utils/tmdbImages';

import { formatDuration } from '../utils/formatDuration';

import { formatRating } from '../utils/formatRating';

import {
  getWatchlist as getBackendWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../services/watchlistService';

import {
  getWatched,
  addToWatched,
  removeFromWatched,
} from '../services/watchedService';

import Button from '../components/common/Button';

import Badge from '../components/common/Badge';

import PopularReviews from '../components/review/PopularReviews';

import SimilarMovies from '../components/movie/SimilarMovies';

import ReviewModal from '../components/review/ReviewModal';

import useMovieDetail from '../hooks/useMovieDetail';

import profile from '../assets/profile.jpg';

function MovieDetail() {
  const { id } = useParams();

  const { user } = useAuth();

  const {
    data,
    loading,
    error,
  } = useMovieDetail(id, 'movie');

  // Movie action state
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState('');

  const [isWatched, setIsWatched] = useState(false);
  const [watchedLoading, setWatchedLoading] = useState(false);
  const [watchedError, setWatchedError] = useState('');

  const [isLiked, setIsLiked] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // User reviews
  const [reviews, setReviews] = useState([]);

  // Check watchlist status
  useEffect(() => {
    async function checkWatchlist() {
      if (!user || !data?.id) {
        setIsWatchlisted(false);
        return;
      }

      try {
        setWatchlistError('');

        const result = await getBackendWatchlist();

        const watchlist = result.watchlist || [];

        const exists = watchlist.some(
          (item) => Number(item.movieId) === Number(data.id)
        );

        setIsWatchlisted(exists);
      } catch (error) {
        console.error('WATCHLIST LOAD ERROR:', error);

        setIsWatchlisted(false);

        setWatchlistError(
          error.message || 'Failed to load watchlist status.'
        );
      }
    }

    checkWatchlist();
  }, [user, data]);

  // Check watched status
  useEffect(() => {
    async function checkWatched() {
      if (!user || !data?.id) {
        setIsWatched(false);
        return;
      }

      try {
        setWatchedError('');

        const result = await getWatched();

        const watched = result.watched || [];

        const exists = watched.some(
          (item) => Number(item.movieId) === Number(data.id)
        );

        setIsWatched(exists);
      } catch (error) {
        console.error('WATCHED LOAD ERROR:', error);

        setIsWatched(false);

        setWatchedError(
          error.message || 'Failed to load watched status.'
        );
      }
    }

    checkWatched();
  }, [user, data]);

  // Handle watchlist
  const handleWatchlist = async () => {
    if (!user) {
      setWatchlistError('Please log in to use your watchlist.');
      return;
    }

    if (!data?.id || watchlistLoading) {
      return;
    }

    try {
      setWatchlistLoading(true);
      setWatchlistError('');

      if (isWatchlisted) {
        await removeFromWatchlist(data.id);

        setIsWatchlisted(false);
      } else {
        await addToWatchlist(data.id);

        setIsWatchlisted(true);
      }
    } catch (error) {
      console.error('WATCHLIST ERROR:', error);

      setWatchlistError(
        error.message || 'Failed to update your watchlist.'
      );
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Handle watched
  const handleWatched = async () => {
    if (!user) {
      setWatchedError('Please log in to mark this as watched.');
      return;
    }

    if (!data?.id || watchedLoading) {
      return;
    }

    try {
      setWatchedLoading(true);
      setWatchedError('');

      if (isWatched) {
        await removeFromWatched(data.id);

        setIsWatched(false);
      } else {
        await addToWatched(data.id);

        setIsWatched(true);

        // Backend removes this movie from watchlist.
        setIsWatchlisted(false);
      }
    } catch (error) {
      console.error('WATCHED ERROR:', error);

      setWatchedError(
        error.message || 'Failed to update watched status.'
      );
    } finally {
      setWatchedLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 pt-32 text-[#F4F4F5]">
        <div className="container mx-auto">
          <p className="text-sm text-[#93939A]">
            Loading movie...
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 pt-32 text-[#F4F4F5]">
        <div className="container mx-auto">
          <p className="text-sm text-red-400">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  // Movie data
  const movie = {
    title: data.title,
    year: data.releaseYear,
    type: 'Movie',
    genre: data.genres,
    duration: formatDuration(data.duration),
    director: data.director,
    country: data.country,
    rating: formatRating(data.rating),
    backdrop: getTmdbImage(
      data.backdropPath,
      'original'
    ),
    description: data.overview,
  };

  // Review published
  const handleReviewPublished = (newReview) => {
    setReviews((currentReviews) => [
      {
        ...newReview,
        id: Date.now(),
        username: 'You',
        profile: profile,
      },
      ...currentReviews,
    ]);

    if (newReview.liked) {
      setIsLiked(true);
    }
  };

  // Cast
  const cast = [
    {
      id: 1,
      name: 'Park Shin-hye',
      role: 'Seo-yeon',
      image: profile,
    },
    {
      id: 2,
      name: 'Jeon Jong-seo',
      role: 'Young-sook',
      image: profile,
    },
    {
      id: 3,
      name: 'Kim Sung-ryoung',
      role: 'Seo-yeon’s Mother',
      image: profile,
    },
    {
      id: 4,
      name: 'Lee El',
      role: 'Young-sook’s Mother',
      image: profile,
    },
    {
      id: 5,
      name: 'Park Ho-san',
      role: 'Seo-yeon’s Father',
      image: profile,
    },
  ];

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* Backdrop */}
      <section className="relative h-[420px] overflow-hidden">

        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

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
              {movie.genre}
            </p>

          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-4">

            {/* Watchlist */}
            <button
              type="button"
              onClick={handleWatchlist}
              disabled={watchlistLoading}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isWatchlisted
                  ? 'text-[#F4F4F5]'
                  : 'text-[#93939A] hover:text-[#F4F4F5]'
              } ${
                watchlistLoading
                  ? 'cursor-not-allowed opacity-50'
                  : ''
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
                {watchlistLoading
                  ? 'Updating...'
                  : 'Watchlist'}
              </span>

            </button>

            {/* Watched */}
            <button
              type="button"
              onClick={handleWatched}
              disabled={watchedLoading}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isWatched
                  ? 'text-[#F4F4F5]'
                  : 'text-[#93939A] hover:text-[#F4F4F5]'
              } ${
                watchedLoading
                  ? 'cursor-not-allowed opacity-50'
                  : ''
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
                {watchedLoading
                  ? 'Updating...'
                  : 'Watched'}
              </span>

            </button>

            {/* Like */}
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

          {watchlistError && (
            <p className="mt-3 text-xs text-red-400">
              {watchlistError}
            </p>
          )}

          {watchedError && (
            <p className="mt-2 text-xs text-red-400">
              {watchedError}
            </p>
          )}

          {/* Movie metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">

            <span className="text-[#D4D4D8]">
              {movie.year}
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

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {movie.country}
            </span>

          </div>

          {/* Director */}
          <p className="mt-3 text-sm text-[#93939A]">
            Director:{' '}

            <span className="text-[#D4D4D8]">
              {movie.director}
            </span>
          </p>

          {/* Description */}
          <div className="mt-4 max-w-2xl">

            <p className="text-sm leading-7 text-[#D4D4D8] sm:text-base">
              {movie.description}
            </p>

          </div>

        </div>

      </section>

      {/* Cast */}
      <section className="container mx-auto px-6 pb-16 pt-14">

        <div className="mb-6">

          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Cast
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Main Cast
          </h2>

        </div>

        <div className="flex gap-6 overflow-x-auto pb-3">

          {cast.map((actor) => (
            <div
              key={actor.id}
              className="w-24 flex-shrink-0 text-center"
            >

              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-[#12141C]">

                <img
                  src={actor.image}
                  alt={actor.name}
                  className="h-full w-full object-cover"
                />

              </div>

              <p className="mt-3 text-sm font-medium text-[#F4F4F5]">
                {actor.name}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-[#93939A]">
                {actor.role}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* User review */}
      {reviews.length > 0 && (
        <section className="container mx-auto px-6 pb-12">

          <div className="mb-6">

            <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
              Your Review
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Your thoughts
            </h2>

          </div>

          <div className="max-w-2xl">

            {reviews.map((review) => (
              <article
                key={review.id}
                className="border-t border-[#27272A] py-6"
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <img
                      src={review.profile}
                      alt={review.username}
                      className="h-9 w-9 rounded-full object-cover"
                    />

                    <div>

                      <p className="text-sm font-semibold">
                        {review.username}
                      </p>

                      <p className="text-xs text-[#93939A]">
                        Watched {review.reviewDate}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-1">

                    <i className="ri-star-fill text-yellow-400"></i>

                    <span className="text-sm font-semibold">
                      {review.rating}/5
                    </span>

                  </div>

                </div>

                <p className="mt-4 text-sm leading-7 text-[#D4D4D8]">
                  {review.reviewText}
                </p>

                {review.liked && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#93939A]">

                    <i className="ri-heart-fill text-red-400"></i>

                    <span>
                      You liked this movie
                    </span>

                  </div>
                )}

                {review.containsSpoiler && (
                  <p className="mt-3 text-xs text-[#93939A]">
                    Contains spoilers
                  </p>
                )}

              </article>
            ))}

          </div>

        </section>
      )}

      {/* Popular reviews */}
      <PopularReviews compact />

      {/* Similar movies */}
      <SimilarMovies
        movieId={id}
      />

      {/* Review modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onPublish={handleReviewPublished}
      />

    </main>
  );
}

export default MovieDetail;