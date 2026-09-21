import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';

import Button from '../common/Button';
import Badge from '../common/Badge';
import ReviewModal from '../review/ReviewModal';

import { getTmdbImage } from '../../utils/tmdbImages';
import dummyPoster from '../../assets/Poster1.jpg';

function Hero({ movies = [] }) {

  const [activeIndex, setActiveIndex] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const featuredItem = movies[activeIndex];

  // =========================
  // EMPTY STATE
  // =========================

  if (!featuredItem) {
    return null;
  }

  // =========================
  // BASIC DATA
  // =========================

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
    featuredItem.genres?.[0]?.name || 'N/A';

  // =========================
  // DURATION
  // =========================

  let duration = 'N/A';

  if (!isSeries && featuredItem.runtime) {

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

  // =========================
  // IMAGES
  // =========================

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

  // =========================
  // WATCHLIST SYNC
  // =========================

  useEffect(() => {

    const savedWatchlist =
      JSON.parse(
        localStorage.getItem('sceneit-watchlist')
      ) || [];

    const alreadyExists =
      savedWatchlist.some(
        (item) =>
          item.id === featuredItem.id &&
          item.type === featuredItem.type
      );

    setIsWatchlisted(alreadyExists);

  }, [featuredItem]);

  // =========================
  // CHANGE ITEM
  // =========================

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

  // =========================
  // REVIEW DATA
  // =========================

  const reviewMovie = {

    id: featuredItem.id,

    title,

    year: releaseYear,

    type: featuredItem.type,

    genre,

    poster,

  };

  // =========================
  // REVIEW
  // =========================

  const handleReviewPublished = () => {
    setIsReviewOpen(false);
  };

  // =========================
  // WATCHLIST
  // =========================

  const handleWatchlist = () => {

    const savedWatchlist =
      JSON.parse(
        localStorage.getItem('sceneit-watchlist')
      ) || [];

    const alreadyExists =
      savedWatchlist.some(
        (item) =>
          item.id === featuredItem.id &&
          item.type === featuredItem.type
      );

    // =========================
    // REMOVE
    // =========================

    if (alreadyExists) {

      const updatedWatchlist =
        savedWatchlist.filter(
          (item) =>
            !(
              item.id === featuredItem.id &&
              item.type === featuredItem.type
            )
        );

      localStorage.setItem(
        'sceneit-watchlist',
        JSON.stringify(updatedWatchlist)
      );

      setIsWatchlisted(false);

      return;
    }

    // =========================
    // ADD
    // =========================

    const itemToSave = {

      id: featuredItem.id,

      title,

      year: releaseYear,

      rating,

      type: featuredItem.type,

      poster,

    };

    const updatedWatchlist = [
      ...savedWatchlist,
      itemToSave,
    ];

    localStorage.setItem(
      'sceneit-watchlist',
      JSON.stringify(updatedWatchlist)
    );

    setIsWatchlisted(true);
  };

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#090A0F] text-[#F4F4F5]">

      {/* BACKGROUND */}

      <img
        src={background}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/80 to-[#090A0F]/20" />

      {/* BOTTOM FADE */}

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090A0F] to-transparent" />

      {/* CONTENT */}

      <div className="relative container mx-auto px-6 pb-24 pt-36 sm:pb-28 sm:pt-40">

        <div className="max-w-2xl">

          {/* TYPE */}

          <div className="mb-2">

            <Badge>
              {featuredItem.type}
            </Badge>

          </div>

          {/* TITLE */}

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* META */}

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

          {/* DESCRIPTION */}

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#D4D4D8] sm:text-base">

            {featuredItem.overview ||
              'No description available.'}

          </p>

          {/* ACTIONS */}

          <div className="mt-5 flex flex-wrap items-center gap-3">

            {/* REVIEW */}

            <Button
              onClick={() => setIsReviewOpen(true)}
            >

              <i className="ri-add-line text-base"></i>

              Review

            </Button>

            {/* WATCHLIST */}

            <Button
              variant="ghost"
              onClick={handleWatchlist}
            >

              <i
                className={`${
                  isWatchlisted
                    ? 'ri-bookmark-fill'
                    : 'ri-bookmark-line'
                } text-base`}
              ></i>

              {isWatchlisted
                ? 'In Watchlist'
                : 'Watchlist'}

            </Button>

          </div>

          {/* INDICATOR */}

          <div className="mt-5 flex items-center gap-2">

            {movies.map((movie, index) => (

              <button
                key={`${movie.type}-${movie.id}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show recommendation ${index + 1}`}
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

      {/* CAROUSEL ARROWS */}

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

      {/* REVIEW MODAL */}

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        movie={reviewMovie}
        onPublish={handleReviewPublished}
      />

    </section>
  );
}

export default Hero;