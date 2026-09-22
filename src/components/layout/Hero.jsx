import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';

import { useAuth } from '../../context/AuthContext';

import Button from '../common/Button';
import Badge from '../common/Badge';
import ReviewModal from '../review/ReviewModal';

import { getTmdbImage } from '../../utils/tmdbImages';

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../../services/watchlistService';

import {
  getMovieDetail,
} from '../../services/movieService';

import {
  createMovieReview,
  likeReview,
} from '../../services/reviewService';

import dummyPoster from '../../assets/Poster1.jpg';

function Hero({ movies = [] }) {
  const { user } = useAuth();

  const [activeIndex, setActiveIndex] = useState(0);

  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState('');

  const [localMovieId, setLocalMovieId] = useState(null);

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const featuredItem = movies[activeIndex];

  useEffect(() => {
    async function syncFeaturedMovie() {
      if (!featuredItem) {
        setLocalMovieId(null);
        setIsWatchlisted(false);
        return;
      }

      if (!user) {
        setLocalMovieId(null);
        setIsWatchlisted(false);
        return;
      }

      try {
        setWatchlistError('');

        const type =
          featuredItem.type === 'Series'
            ? 'series'
            : 'movie';

        const detail = await getMovieDetail(
          featuredItem.id,
          type
        );

        setLocalMovieId(detail.id);

        const result = await getWatchlist();

        const watchlist = result.watchlist || [];

        const exists = watchlist.some(
          (item) =>
            Number(item.movieId) === Number(detail.id)
        );

        setIsWatchlisted(exists);
      } catch (error) {
        console.error(
          'HERO WATCHLIST SYNC ERROR:',
          error
        );

        setLocalMovieId(null);
        setIsWatchlisted(false);
      }
    }

    syncFeaturedMovie();
  }, [featuredItem, user]);

  useEffect(() => {
    if (movies.length === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= movies.length) {
      setActiveIndex(0);
    }
  }, [movies, activeIndex]);

  if (!featuredItem) {
    return null;
  }

  const isSeries =
    featuredItem.type === 'Series';

  const title =
    isSeries
      ? featuredItem.name
      : featuredItem.title;

  const releaseDate =
    isSeries
      ? featuredItem.first_air_date
      : featuredItem.release_date;

  const releaseYear =
    releaseDate
      ? releaseDate.slice(0, 4)
      : 'N/A';

  const rating =
    featuredItem.vote_average
      ? featuredItem.vote_average.toFixed(1)
      : 'N/A';

  const genre =
    featuredItem.genres?.[0]?.name ||
    'N/A';

  let duration = 'N/A';

  if (
    !isSeries &&
    featuredItem.runtime
  ) {
    duration =
      `${Math.floor(featuredItem.runtime / 60)}h ${
        featuredItem.runtime % 60
      }m`;
  } else if (
    isSeries &&
    featuredItem.episode_run_time?.length
  ) {
    duration =
      `${featuredItem.episode_run_time[0]}m / episode`;
  }

  const background =
    featuredItem.backdrop_path
      ? getTmdbImage(
          featuredItem.backdrop_path,
          'original'
        )
      : dummyPoster;

  const poster =
    featuredItem.poster_path
      ? getTmdbImage(
          featuredItem.poster_path,
          'w500'
        )
      : dummyPoster;

  const handlePrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0
        ? movies.length - 1
        : currentIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === movies.length - 1
        ? 0
        : currentIndex + 1
    );
  };

  const handleWatchlist = async () => {
    if (!user) {
      setWatchlistError(
        'Please log in to use your watchlist.'
      );
      return;
    }

    if (!localMovieId || watchlistLoading) {
      return;
    }

    try {
      setWatchlistLoading(true);
      setWatchlistError('');

      if (isWatchlisted) {
        await removeFromWatchlist(
          localMovieId
        );

        setIsWatchlisted(false);
      } else {
        await addToWatchlist(
          localMovieId
        );

        setIsWatchlisted(true);
      }
    } catch (error) {
      console.error(
        'HERO WATCHLIST ERROR:',
        error
      );

      setWatchlistError(
        error.message ||
          'Failed to update your watchlist.'
      );
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleReviewPublished = async (
    reviewData
  ) => {
    if (!user) {
      throw new Error(
        'Please log in to write a review.'
      );
    }

    if (!localMovieId || reviewLoading) {
      throw new Error(
        'Movie information is not ready yet.'
      );
    }

    try {
      setReviewLoading(true);
      setReviewError('');

      const result = await createMovieReview(
        localMovieId,
        {
          rating: reviewData.rating,
          content: reviewData.reviewText,
          containsSpoiler:
            reviewData.containsSpoiler,
        }
      );

      const createdReview =
        result.review;

      if (
        reviewData.liked &&
        createdReview?.id
      ) {
        await likeReview(
          createdReview.id
        );
      }

      setIsReviewOpen(false);
    } catch (error) {
      console.error(
        'HERO REVIEW ERROR:',
        error
      );

      setReviewError(
        error.message ||
          'Failed to publish your review.'
      );

      throw error;
    } finally {
      setReviewLoading(false);
    }
  };

  const reviewMovie = {
    id: localMovieId,
    tmdbId: featuredItem.id,
    title,
    year: releaseYear,
    type: featuredItem.type,
    genre,
    poster,
  };

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#090A0F] text-[#F4F4F5]">

      <img
        src={background}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/80 to-[#090A0F]/20" />

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090A0F] to-transparent" />

      <div className="relative container mx-auto px-6 pb-24 pt-36 sm:pb-28 sm:pt-40">

        <div className="max-w-2xl">

          <div className="mb-2">
            <Badge>
              {featuredItem.type}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">

            <div className="flex items-center gap-1.5">

              <i className="ri-star-fill text-yellow-400"></i>

              <span className="font-semibold text-[#F4F4F5]">
                {rating}
              </span>

            </div>

            <span className="text-[#93939A]">
              {releaseYear}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#93939A]">
              {genre}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#93939A]">
              {duration}
            </span>

          </div>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#D4D4D8] sm:text-base">
            {featuredItem.overview ||
              'No description available.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">

            <Button
              onClick={() => {
                if (!user) {
                  setReviewError(
                    'Please log in to write a review.'
                  );
                  return;
                }

                setReviewError('');
                setIsReviewOpen(true);
              }}
            >
              <i className="ri-add-line text-base"></i>
              Review
            </Button>

            <Button
              variant="ghost"
              onClick={handleWatchlist}
              disabled={
                watchlistLoading ||
                !localMovieId
              }
            >
              <i
                className={`${
                  isWatchlisted
                    ? 'ri-bookmark-fill'
                    : 'ri-bookmark-line'
                } text-base`}
              ></i>

              {watchlistLoading
                ? 'Updating...'
                : isWatchlisted
                  ? 'In Watchlist'
                  : 'Watchlist'}
            </Button>

          </div>

          {watchlistError && (
            <p className="mt-3 text-xs text-red-400">
              {watchlistError}
            </p>
          )}

          {reviewError && !isReviewOpen && (
            <p className="mt-3 text-xs text-red-400">
              {reviewError}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2">

            {movies.map((movie, index) => (
              <button
                key={`${movie.type}-${movie.id}`}
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                aria-label={`Show recommendation ${
                  index + 1
                }`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-6 bg-[#F4F4F5]'
                    : 'w-1.5 bg-[#93939A]/50'
                }`}
              />
            ))}

          </div>

        </div>

      </div>

      {movies.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous recommendation"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl text-[#F4F4F5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform hover:scale-125 sm:left-8 sm:text-4xl"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next recommendation"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-3xl text-[#F4F4F5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-transform hover:scale-125 sm:right-8 sm:text-4xl"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </>
      )}

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() =>
          setIsReviewOpen(false)
        }
        movie={reviewMovie}
        onPublish={handleReviewPublished}
      />

    </section>
  );
}

export default Hero;