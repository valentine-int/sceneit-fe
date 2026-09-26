import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import { useToast } from '../context/ToastContext';

import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SimilarSeries from '../components/movie/SimilarSeries';
import ReviewCard from '../components/review/ReviewCard';
import ReviewModal from '../components/review/ReviewModal';
import ReportReviewModal from '../components/review/ReportReviewModal';
import TmdbReviews from '../components/review/TmdbReviews';

import {
  getMovieReviews,
  createMovieReview,
  likeReview,
  unlikeReview,
  reportReview,
} from '../services/reviewService';

import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../services/watchlistService';

import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} from '../services/favoriteService';

import {
  getWatched,
  addToWatched,
  removeFromWatched,
} from '../services/watchedService';

import useSeriesDetail from '../hooks/useSeriesDetail';
import { getTmdbImage } from '../utils/tmdbImages';

function SeriesDetail() {
  const { id } = useParams();
  const { data, loading, error } = useSeriesDetail(id);
  const { showToast } = useToast();

  // Series action state
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
  const [reportingReviewId, setReportingReviewId] = useState(null);

  // Load reviews for this series
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
        console.error('SERIES REVIEWS LOAD ERROR:', error);

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

  // Sync favorite status once series id is known
  useEffect(() => {
    async function syncFavoriteStatus() {
      if (!data?.id) {
        setIsLiked(false);
        return;
      }

      try {
        const result = await getFavorites();
        const favorites = result.favorites || [];

        const exists = favorites.some(
          (item) => Number(item.movieId) === Number(data.id)
        );

        setIsLiked(exists);
      } catch (error) {
        console.error('SERIES FAVORITE SYNC ERROR:', error);
        setIsLiked(false);
      }
    }

    syncFavoriteStatus();
  }, [data]);

  // Sync watchlist and watched status
  useEffect(() => {
    async function syncWatchStatus() {
      if (!data?.id) {
        setIsWatchlisted(false);
        setIsWatched(false);
        return;
      }

      try {
        const [watchlistResult, watchedResult] = await Promise.all([
          getWatchlist(),
          getWatched(),
        ]);

        const inWatchlist = (
          watchlistResult.watchlist || []
        ).some(
          (item) => Number(item.movieId) === Number(data.id)
        );

        const inWatched = (
          watchedResult.watched || []
        ).some(
          (item) => Number(item.movieId) === Number(data.id)
        );

        setIsWatchlisted(inWatchlist);
        setIsWatched(inWatched);
      } catch (error) {
        console.error('SERIES WATCH STATUS SYNC ERROR:', error);
      }
    }

    syncWatchStatus();
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

  // Add or remove series from watchlist
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
      console.error('SERIES WATCHLIST ERROR:', error);
    }
  };

  // Add or remove series from watched
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
      console.error('SERIES WATCHED ERROR:', error);
    }
  };

  // Add or remove series from favorites
  const handleFavorite = async () => {
    if (!data?.id) {
      return;
    }

    try {
      if (isLiked) {
        await removeFromFavorites(data.id);
        setIsLiked(false);
      } else {
        await addToFavorites(data.id);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('SERIES FAVORITE ERROR:', error);
    }
  };

  // Like or unlike a review
  const handleReviewLike = async (reviewId) => {
    if (processingLikes.includes(reviewId)) {
      return;
    }

    const isCurrentlyLiked = likedReviews.includes(reviewId);

    try {
      setProcessingLikes((current) => [
        ...current,
        reviewId,
      ]);

      if (isCurrentlyLiked) {
        await unlikeReview(reviewId);

        setLikedReviews((current) =>
          current.filter((id) => id !== reviewId)
        );

        setReviews((current) =>
          current.map((review) =>
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

      setLikedReviews((current) => [
        ...current,
        reviewId,
      ]);

      setReviews((current) =>
        current.map((review) =>
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
      console.error('SERIES REVIEW LIKE ERROR:', error);
    } finally {
      setProcessingLikes((current) =>
        current.filter((id) => id !== reviewId)
      );
    }
  };

  // Report a review
  const handleSubmitReport = async (reason) => {
    await reportReview(reportingReviewId, reason);
    setReportingReviewId(null);
    showToast('Report submitted. Thank you!', 'success');
  };

  // Create review and optionally like the new review
  const handleReviewPublished = async (newReview) => {
    if (!data?.id) {
      throw new Error('Series data is not available.');
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

        setLikedReviews((current) => [
          ...current,
          createdReview.id,
        ]);
      } catch (error) {
        console.error('SERIES REVIEW LIKE ERROR:', error);
      }
    }

    // Reload reviews so the new review appears immediately
    const updatedResult = await getMovieReviews(data.id);

    setReviews(updatedResult.reviews || []);
    setIsWatched(true);
    setIsWatchlisted(false);

    showToast('Your review was published!', 'success');
    setIsReviewOpen(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">
        <section className="container mx-auto px-6 pb-20 pt-32">
          <div className="py-20 text-center">
            <i className="ri-loader-4-line animate-spin text-3xl text-[#93939A]"></i>

            <p className="mt-4 text-sm text-[#93939A]">
              Loading series details...
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
              Could not load this series
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              {error?.message ||
                'Series data is not available.'}
            </p>
          </div>
        </section>
      </main>
    );
  }

  const seasons = data.seasons?.length || 0;

  const episodes =
    data.seasons?.reduce(
      (total, season) =>
        total + (season.episodeCount || 0),
      0
    ) || 0;

  const series = {
    title: data.title,
    year: data.releaseYear,
    genre: data.genres,
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

        {series.backdrop && (
          <img
            src={series.backdrop}
            alt={series.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/70 to-[#090A0F]/10" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F]/70 to-transparent" />

      </section>

      {/* Series information */}

      <section className="container mx-auto px-6">

        <div className="-mt-24 relative z-10 max-w-4xl">

          <div>

            <Badge>
              Series
            </Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {series.title}
            </h1>

            <p className="mt-4 text-sm text-[#93939A]">
              {series.genre || 'Unknown genre'}
            </p>

          </div>

          {/* Series actions */}

          <div className="mt-4 flex flex-wrap items-center gap-4">

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

            <button
              type="button"
              onClick={handleFavorite}
              className={`transition-colors ${
                isLiked
                  ? 'text-red-400'
                  : 'text-[#93939A] hover:text-[#F4F4F5]'
              }`}
              aria-label={
                isLiked
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <i
                className={`${
                  isLiked
                    ? 'ri-heart-fill'
                    : 'ri-heart-line'
                } text-xl`}
              ></i>
            </button>

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
              {series.year || 'N/A'}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {seasons} Season{seasons !== 1 ? 's' : ''}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {episodes} Episodes
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <div className="flex items-center gap-1.5">

              <i className="ri-star-fill text-yellow-400"></i>

              <span className="font-semibold text-[#F4F4F5]">
                {series.rating}
              </span>

            </div>

          </div>

          {/* Description */}

          <div className="mt-4 max-w-2xl">

            <p className="text-sm leading-7 text-[#D4D4D8] sm:text-base">
              {series.description}
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
                    poster={series.poster}
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
                    onReport={() =>
                      setReportingReviewId(review.id)
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

      {/* TMDB reviews */}

      <TmdbReviews
        tmdbId={data.tmdbId}
        type="series"
      />

      {/* Similar series */}

      <SimilarSeries
        seriesId={data.tmdbId}
      />

      {/* Review modal */}

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onPublish={handleReviewPublished}
        movie={{
          title: series.title,
          year: series.year,
          genre: series.genre,
          poster: series.poster,
        }}
      />

      {/* Report review modal */}

      <ReportReviewModal
        isOpen={reportingReviewId !== null}
        onClose={() => setReportingReviewId(null)}
        onSubmit={handleSubmitReport}
      />

    </main>
  );
}

export default SeriesDetail;