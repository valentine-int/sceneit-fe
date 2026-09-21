import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import MovieCard from '../../components/movie/MovieCard';
import ReviewCard from '../../components/review/ReviewCard';

import profile from '../../assets/profile.jpg';
import dummyPoster from '../../assets/Poster1.jpg';

import {
  getWatchlist,
  getWatched,
  getFavorites,
  getReviews,
} from '../../utils/sceneitStorage';

function PublicProfile() {

  // =========================
  // PROFILE ACTIVITY STATE
  // =========================

  const [watched, setWatched] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);

  // =========================
  // LOAD USER ACTIVITY
  // =========================

useEffect(() => {
  const loadUserActivity = () => {
    const savedWatched = getWatched();
    const savedFavorites = getFavorites();
    const savedWatchlist = getWatchlist();
    const savedReviews = getReviews();

    setWatched(savedWatched);
    setFavorites(savedFavorites);
    setWatchlist(savedWatchlist);
    setReviews(savedReviews);
  };

  loadUserActivity();

  window.addEventListener(
    'sceneit-storage',
    loadUserActivity
  );

  return () => {
    window.removeEventListener(
      'sceneit-storage',
      loadUserActivity
    );
  };
}, []);


  // =========================
  // FORMAT REVIEW DATE
  // =========================

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

  // =========================
  // DUMMY PROFILE DATA
  // =========================

  const user = {
    name: 'Feby Valentine Samosir',
    username: 'feby.yrn',
    joined: 'Joined Sept 2026',
    avatar: profile,
  };

  // =========================
  // PROFILE STATS
  // =========================

  const stats = [
    {
      label: 'Watched',
      value: watched.length,
    },
    {
      label: 'Reviews',
      value: reviews.length,
    },
    {
      label: 'Favorite',
      value: favorites.length,
    },
    {
      label: 'Watchlist',
      value: watchlist.length,
    },
    {
      label: 'Followers',
      value: 42,
    },
  ];

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* =========================
          PROFILE HEADER
      ========================= */}

      <section className="container mx-auto px-6 pb-10 pt-32">

        <div className="border-b border-[#27272A] pb-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* AVATAR */}

            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />

            {/* USER INFORMATION */}

            <div className="min-w-0 flex-1">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {user.name}
                  </h1>

                  <p className="mt-1 text-sm text-[#93939A]">
                    @{user.username}
                  </p>

                  <p className="mt-2 text-xs text-[#93939A]">
                    {user.joined}
                  </p>

                </div>

                {/* EDIT PROFILE */}

                <button
                  type="button"
                  className="w-fit rounded-lg border border-[#27272A] px-4 py-2 text-sm font-medium text-[#F4F4F5] transition-colors hover:bg-[#12141C]"
                >
                  <i className="ri-edit-line mr-2"></i>
                  Edit Profile
                </button>

              </div>

              {/* STATS */}

              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#27272A] pt-5">

                {stats.map((stat) => (
                  <div key={stat.label}>

                    <p className="text-lg font-bold">
                      {stat.value}
                    </p>

                    <p className="mt-0.5 text-xs text-[#93939A]">
                      {stat.label}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          FAVORITES
      ========================= */}

      <section className="container mx-auto px-6 pb-12">

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              Personal picks
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Feby's Favorite
            </h2>

          </div>

          <Link
            to="/me/favorite"
            className="hidden text-2xl text-[#93939A] transition-colors hover:text-[#F4F4F5] sm:block"
            aria-label="View all favorites"
          >
            <i className="ri-arrow-right-s-line"></i>
          </Link>

        </div>

        {favorites.length > 0 ? (

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

            {favorites.slice(0, 6).map((movie) => (

              <MovieCard
                key={`${movie.type}-${movie.id}`}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                type={movie.type}
                poster={movie.poster}
              />

            ))}

          </div>

        ) : (

          <div className="border-t border-[#27272A] py-12 text-center">

            <i className="ri-heart-line text-3xl text-[#52525B]"></i>

            <h3 className="mt-4 text-lg font-semibold">
              No favorites yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              Like movies and series you love and they will appear here.
            </p>

            <Link
              to="/movies"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7]"
            >
              Browse Movies
              <i className="ri-arrow-right-s-line"></i>
            </Link>

          </div>

        )}

      </section>

      {/* =========================
          RECENT REVIEWS
      ========================= */}

      <section className="container mx-auto px-6 pb-12">

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              From your activity
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Recent Reviews
            </h2>

          </div>

          <Link
            to="/me/reviews"
            className="hidden text-2xl text-[#93939A] transition-colors hover:text-[#F4F4F5] sm:block"
            aria-label="View all reviews"
          >
            <i className="ri-arrow-right-s-line"></i>
          </Link>

        </div>

        {reviews.length > 0 ? (

          <div className="flex flex-col gap-4">

            {reviews.slice(0, 2).map((review) => (

              <ReviewCard
                key={review.id}
                username={user.name}
                avatar={user.avatar}
                poster={review.poster || dummyPoster}
                rating={review.rating}
                date={formatReviewDate(review.reviewDate)}
                review={review.reviewText}
                likes={0}
                showPoster={true}
              />

            ))}

          </div>

        ) : (

          <div className="border-t border-[#27272A] py-12 text-center">

            <i className="ri-chat-quote-line text-3xl text-[#52525B]"></i>

            <h3 className="mt-4 text-lg font-semibold">
              No reviews yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              Write a review for a movie or series and it will appear here.
            </p>

            <Link
              to="/movies"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7]"
            >
              Browse Movies
              <i className="ri-arrow-right-s-line"></i>
            </Link>

          </div>

        )}

      </section>

      {/* =========================
          WATCHED
      ========================= */}

      <section className="container mx-auto px-6 pb-12">

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              Your viewing history
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Feby's Watched
            </h2>

          </div>

          <Link
            to="/me/watched"
            className="hidden text-2xl text-[#93939A] transition-colors hover:text-[#F4F4F5] sm:block"
            aria-label="View all watched"
          >
            <i className="ri-arrow-right-s-line"></i>
          </Link>

        </div>

        {watched.length > 0 ? (

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

            {watched.slice(0, 6).map((movie) => (

              <MovieCard
                key={`${movie.type}-${movie.id}`}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                type={movie.type}
                poster={movie.poster}
              />

            ))}

          </div>

        ) : (

          <div className="border-t border-[#27272A] py-12 text-center">

            <i className="ri-checkbox-circle-line text-3xl text-[#52525B]"></i>

            <h3 className="mt-4 text-lg font-semibold">
              No watched titles yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              Movies and series you mark as watched will appear here.
            </p>

            <Link
              to="/movies"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7]"
            >
              Browse Movies
              <i className="ri-arrow-right-s-line"></i>
            </Link>

          </div>

        )}

      </section>

      {/* =========================
          WATCHLIST
      ========================= */}

      <section className="container mx-auto px-6 pb-20">

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              Saved for later
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Feby's Watchlist
            </h2>

          </div>

          <Link
            to="/me/watchlist"
            className="hidden text-2xl text-[#93939A] transition-colors hover:text-[#F4F4F5] sm:block"
            aria-label="View all watchlist"
          >
            <i className="ri-arrow-right-s-line"></i>
          </Link>

        </div>

        {watchlist.length > 0 ? (

          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

            {watchlist.slice(0, 6).map((movie) => (

              <MovieCard
                key={`${movie.type}-${movie.id}`}
                id={movie.id}
                title={movie.title}
                year={movie.year}
                rating={movie.rating}
                type={movie.type}
                poster={movie.poster}
              />

            ))}

          </div>

        ) : (

          <div className="border-t border-[#27272A] py-12 text-center">

            <i className="ri-bookmark-line text-3xl text-[#52525B]"></i>

            <h3 className="mt-4 text-lg font-semibold">
              Your watchlist is empty
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              Save movies and series you want to watch later and they will appear here.
            </p>

            <Link
              to="/movies"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7]"
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

export default PublicProfile;