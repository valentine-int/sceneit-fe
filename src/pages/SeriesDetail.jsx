import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import PopularReviews from '../components/review/PopularReviews';
import SimilarSeries from '../components/movie/SimilarSeries';
import ReviewModal from '../components/review/ReviewModal';

import profile from '../assets/profile.jpg';
import dummyPoster from '../assets/Poster1.jpg';

import useSeriesDetail from '../hooks/useSeriesDetail';

import {
  getReviews,
  getWatchlist,
  saveWatchlist,
  getWatched,
  saveWatched,
  getFavorites,
  saveFavorites,
} from '../utils/sceneitStorage';

function SeriesDetail() {
  const { id } = useParams();

  const {
    data,
    loading,
    error,
  } = useSeriesDetail(id);

  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [reviews, setReviews] = useState([]);

  const series = data?.series;
  const cast = data?.cast || [];


  useEffect(() => {
  const loadReviews = () => {
    const savedReviews = getReviews();

    const seriesReviews = savedReviews.filter(
      (review) =>
        Number(review.movieId) === Number(series.id) &&
        review.type === 'Series'
    );

    setReviews(seriesReviews);
  };

  if (series?.id) {
    loadReviews();
  }

  window.addEventListener(
    'sceneit-storage',
    loadReviews
  );

  return () => {
    window.removeEventListener(
      'sceneit-storage',
      loadReviews
    );
  };
}, [series?.id]);

  // =========================
  // SERIES INFORMATION
  // =========================

  const releaseYear =
    series?.first_air_date
      ? series.first_air_date.slice(0, 4)
      : 'N/A';

  const rating =
    series?.vote_average
      ? series.vote_average.toFixed(1)
      : 'N/A';

  const genre =
    series?.genres?.[0]?.name || 'N/A';

  const seasons =
    series?.number_of_seasons || 0;

  const episodes =
    series?.number_of_episodes || 0;

  const duration =
    series?.episode_run_time?.length
      ? `${series.episode_run_time[0]}m / episode`
      : 'N/A';

  const poster =
    series?.poster_path
      ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
      : dummyPoster;

  // =========================
  // SYNC SAVED STATES
  // =========================

  useEffect(() => {
    if (!series) return;

    const savedWatchlist = getWatchlist();
    const savedWatched = getWatched();
    const savedFavorites = getFavorites();

    const alreadyWatchlisted = savedWatchlist.some(
      (item) =>
        item.id === series.id &&
        item.type === 'Series'
    );

    const alreadyWatched = savedWatched.some(
      (item) =>
        item.id === series.id &&
        item.type === 'Series'
    );

    const alreadyFavorite = savedFavorites.some(
      (item) =>
        item.id === series.id &&
        item.type === 'Series'
    );

    setIsWatchlisted(alreadyWatchlisted);
    setIsWatched(alreadyWatched);
    setIsLiked(alreadyFavorite);
  }, [series]);

  // =========================
  // WATCHLIST
  // =========================

  const handleWatchlist = () => {
    if (!series) return;

    const savedWatchlist = getWatchlist();

    const alreadyExists = savedWatchlist.some(
      (item) =>
        item.id === series.id &&
        item.type === 'Series'
    );

    if (alreadyExists) {
      const updatedWatchlist =
        savedWatchlist.filter(
          (item) =>
            !(
              item.id === series.id &&
              item.type === 'Series'
            )
        );

      saveWatchlist(updatedWatchlist);

      setIsWatchlisted(false);

      return;
    }

    const seriesToSave = {
      id: series.id,
      title: series.name,
      year: releaseYear,
      rating,
      type: 'Series',
      poster,
    };

    const updatedWatchlist = [
      ...savedWatchlist,
      seriesToSave,
    ];

    saveWatchlist(updatedWatchlist);

    setIsWatchlisted(true);
  };

  // =========================
  // WATCHED
  // =========================

  const handleWatched = () => {
    if (!series) return;

    const savedWatched = getWatched();

    const alreadyExists = savedWatched.some(
      (item) =>
        item.id === series.id &&
        item.type === 'Series'
    );

    if (alreadyExists) {
      const updatedWatched =
        savedWatched.filter(
          (item) =>
            !(
              item.id === series.id &&
              item.type === 'Series'
            )
        );

      saveWatched(updatedWatched);

      setIsWatched(false);

      return;
    }

    const seriesToSave = {
      id: series.id,
      title: series.name,
      year: releaseYear,
      rating,
      type: 'Series',
      poster,
    };

    const updatedWatched = [
      ...savedWatched,
      seriesToSave,
    ];

    saveWatched(updatedWatched);

    setIsWatched(true);
  };

  // =========================
  // FAVORITE
  // =========================

  const handleLike = () => {
    if (!series) return;

    const savedFavorites = getFavorites();

    const alreadyExists = savedFavorites.some(
      (item) =>
        item.id === series.id &&
        item.type === 'Series'
    );

    if (alreadyExists) {
      const updatedFavorites =
        savedFavorites.filter(
          (item) =>
            !(
              item.id === series.id &&
              item.type === 'Series'
            )
        );

      saveFavorites(updatedFavorites);

      setIsLiked(false);

      return;
    }

    const seriesToSave = {
      id: series.id,
      title: series.name,
      year: releaseYear,
      rating,
      type: 'Series',
      poster,
    };

    const updatedFavorites = [
      ...savedFavorites,
      seriesToSave,
    ];

    saveFavorites(updatedFavorites);

    setIsLiked(true);
  };

  // =========================
  // REVIEW PUBLISHED
  // =========================

  const handleReviewPublished = (newReview) => {
    if (!series) return;

    // -------------------------
    // AUTO MARK AS WATCHED
    // -------------------------

    const savedWatched = getWatched();

    const alreadyWatched = savedWatched.some(
      (item) =>
        item.id === series.id &&
        item.type === 'Series'
    );

    if (!alreadyWatched) {
      const seriesToSave = {
        id: series.id,
        title: series.name,
        year: releaseYear,
        rating,
        type: 'Series',
        poster,
      };

      const updatedWatched = [
        ...savedWatched,
        seriesToSave,
      ];

      saveWatched(updatedWatched);
    }

    setIsWatched(true);

    // -------------------------
    // ADD REVIEW TO PAGE
    // -------------------------

    setReviews((currentReviews) => [
      {
        ...newReview,
        username: 'You',
        profile,
      },
      ...currentReviews,
    ]);

    // -------------------------
    // AUTO ADD FAVORITE
    // -------------------------

    if (newReview.liked) {
      const savedFavorites = getFavorites();

      const alreadyFavorite = savedFavorites.some(
        (item) =>
          item.id === series.id &&
          item.type === 'Series'
      );

      if (!alreadyFavorite) {
        const seriesToSave = {
          id: series.id,
          title: series.name,
          year: releaseYear,
          rating,
          type: 'Series',
          poster,
        };

        const updatedFavorites = [
          ...savedFavorites,
          seriesToSave,
        ];

        saveFavorites(updatedFavorites);
      }

      setIsLiked(true);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 pt-32 text-[#F4F4F5]">
        <div className="container mx-auto">
          <p className="text-sm text-[#93939A]">
            Loading series...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 pt-32 text-[#F4F4F5]">
        <div className="container mx-auto">
          <p className="text-sm text-red-400">
            Failed to load series.
          </p>
        </div>
      </main>
    );
  }

  if (!series) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 pt-32 text-[#F4F4F5]">
        <div className="container mx-auto">
          <p className="text-sm text-[#93939A]">
            Series not found.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // REVIEW MODAL DATA
  // =========================

  const reviewSeries = {
    id: series.id,
    title: series.name,
    year: releaseYear,
    type: 'Series',
    genre,
    poster,
  };

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* =========================
          BACKDROP
      ========================= */}

      <section className="relative h-[420px] overflow-hidden">

        <img
          src={
            series.backdrop_path
              ? `https://image.tmdb.org/t/p/original${series.backdrop_path}`
              : dummyPoster
          }
          alt={series.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/70 to-[#090A0F]/10" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F]/70 to-transparent" />

      </section>

      {/* =========================
          SERIES INFORMATION
      ========================= */}

      <section className="container mx-auto px-6">

        <div className="-mt-24 relative z-10 max-w-4xl">

          <div>

            <Badge>
              Series
            </Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {series.name}
            </h1>

            <p className="mt-1 text-sm text-[#93939A]">
              {genre}
            </p>

          </div>

          {/* ACTION BUTTONS */}

          <div className="mt-4 flex flex-wrap items-center gap-4">

            {/* WATCHLIST */}

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

            {/* WATCHED */}

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

            {/* FAVORITE */}

            <button
              type="button"
              onClick={handleLike}
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

            {/* REVIEW */}

            <Button
              onClick={() => setIsReviewOpen(true)}
            >
              <i className="ri-add-line text-base"></i>
              Review
            </Button>

          </div>

          {/* SERIES METADATA */}

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">

            <span className="text-[#D4D4D8]">
              {releaseYear}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {seasons} seasons
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {episodes} episodes
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {duration}
            </span>

            <span className="text-[#52525B]">
              •
            </span>

            <div className="flex items-center gap-1.5">

              <i className="ri-star-fill text-yellow-400"></i>

              <span className="font-semibold text-[#F4F4F5]">
                {rating}
              </span>

            </div>

            <span className="text-[#52525B]">
              •
            </span>

            <span className="text-[#D4D4D8]">
              {series.origin_country?.[0] || 'N/A'}
            </span>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-4 max-w-2xl">

            <p className="text-sm leading-7 text-[#D4D4D8] sm:text-base">
              {series.overview || 'No description available.'}
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          CAST
      ========================= */}

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
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : profile
                  }
                  alt={actor.name}
                  className="h-full w-full object-cover"
                />

              </div>

              <p className="mt-3 text-sm font-medium text-[#F4F4F5]">
                {actor.name}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-[#93939A]">
                {actor.character}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* =========================
          USER REVIEW
      ========================= */}

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
                      src={review.profile || profile}
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
                      You liked this series
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

      {/* =========================
          POPULAR REVIEWS
      ========================= */}

      <PopularReviews compact />

      {/* =========================
          SIMILAR SERIES
      ========================= */}

      <SimilarSeries seriesId={series.id} />

      {/* =========================
          REVIEW MODAL
      ========================= */}

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        movie={reviewSeries}
        onPublish={handleReviewPublished}
      />

    </main>
  );
}

export default SeriesDetail;