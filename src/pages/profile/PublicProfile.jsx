import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import MovieCard from '../../components/movie/MovieCard';
import ReviewCard from '../../components/review/ReviewCard';
import FollowButton from '../../components/common/FollowButton';

import { useAuth } from '../../context/AuthContext';
import { getWatchlist } from '../../services/watchlistService';
import { getWatched } from '../../services/watchedService';
import { getFavorites } from '../../services/favoriteService';
import { getMyReviews } from '../../services/reviewService';
import { getFollowStatus, getFollowers, getFollowing } from '../../services/socialService';
import { getTmdbImage } from '../../utils/tmdbImages';
import { updateProfile } from '../../services/authService';

import EditProfileModal from '../../components/profile/EditProfileModal';

import profile from '../../assets/profile.jpg';
import dummyPoster from '../../assets/Poster1.jpg';

function formatReviewDate(date) {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function toCardType(type) {
  return type === 'series' ? 'Series' : 'Movie';
}

function PublicProfile() {
  const { userId } = useParams();

  const {
    user: currentUser,
    isLoading: authLoading,
    setUser,
  } = useAuth();

  // isOwnProfile: no :userId param => viewing my own profile
  const isOwnProfile = !userId;
  const profileUserId = userId ? Number(userId) : currentUser?.id;

  const [watched, setWatched] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!profileUserId) {
      setLoading(false);
      return;
    }

    loadProfileData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUserId, authLoading]);

  async function loadProfileData() {
    try {
      setLoading(true);
      setError('');

      const requests = [
        getFollowers(profileUserId),
        getFollowing(profileUserId),
      ];

      // Activity data is only available for the logged-in user's own account.
      if (isOwnProfile) {
        requests.push(
          getWatched(),
          getFavorites(),
          getWatchlist(),
          getMyReviews()
        );
      }

      if (!isOwnProfile && currentUser) {
        requests.push(getFollowStatus(profileUserId));
      }

      const results = await Promise.all(requests);

      const followersResult = results[0];
      const followingResult = results[1];

      setFollowersCount((followersResult.followers || []).length);
      setFollowingCount((followingResult.following || []).length);

      let nextIndex = 2;

      if (isOwnProfile) {
        const watchedResult = results[nextIndex++];
        const favoritesResult = results[nextIndex++];
        const watchlistResult = results[nextIndex++];
        const reviewsResult = results[nextIndex++];

        setWatched(watchedResult.watched || []);
        setFavorites(favoritesResult.favorites || []);
        setWatchlist(watchlistResult.watchlist || []);
        setReviews(reviewsResult.reviews || []);
      }

      if (!isOwnProfile && currentUser) {
        const statusResult = results[nextIndex++];
        setIsFollowing(Boolean(statusResult?.isFollowing));
      }
    } catch (err) {
      console.error('PUBLIC PROFILE LOAD ERROR:', err);
      setError(err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSave(data) {
    const result = await updateProfile(data);
    setUser(result.user);
    setIsEditOpen(false);
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
        <section className="container mx-auto text-center">
          <i className="ri-loader-4-line animate-spin text-3xl text-[#93939A]"></i>
          <p className="mt-4 text-sm text-[#93939A]">
            Loading profile...
          </p>
        </section>
      </main>
    );
  }

  if (isOwnProfile && !currentUser) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
        <section className="container mx-auto text-center">
          <i className="ri-user-line text-3xl text-[#52525B]"></i>
          <h1 className="mt-4 text-xl font-semibold">Please log in</h1>
          <p className="mt-2 text-sm text-[#93939A]">
            Log in to view your profile.
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
        <section className="container mx-auto text-center">
          <i className="ri-error-warning-line text-3xl text-[#52525B]"></i>
          <p className="mt-4 text-sm text-[#93939A]">{error}</p>
        </section>
      </main>
    );
  }

  const displayUser = isOwnProfile
    ? {
        name: currentUser?.name,
        avatar: currentUser?.avatarUrl || profile,
        bio: currentUser?.bio,
      }
    : {
        // Public user data is not available from a dedicated endpoint yet.
        name: 'User',
        avatar: profile,
        bio: null,
      };

  const stats = [
    ...(isOwnProfile
      ? [
          { label: 'Watched', value: watched.length },
          { label: 'Reviews', value: reviews.length },
          { label: 'Favorite', value: favorites.length },
          { label: 'Watchlist', value: watchlist.length },
        ]
      : []),
    { label: 'Followers', value: followersCount },
    { label: 'Following', value: followingCount },
  ];

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">
      {/* PROFILE HEADER */}
      <section className="container mx-auto px-6 pb-10 pt-32">
        <div className="border-b border-[#27272A] pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src={displayUser.avatar}
              alt={displayUser.name}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {displayUser.name}
                  </h1>

                  {displayUser.bio && (
                    <p className="mt-2 max-w-md text-sm text-[#93939A]">
                      {displayUser.bio}
                    </p>
                  )}
                </div>

                {isOwnProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(true)}
                    className="w-fit rounded-lg border border-[#27272A] px-4 py-2 text-sm font-medium text-[#F4F4F5] transition-colors hover:bg-[#12141C]"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Edit Profile
                  </button>
                ) : (
                  currentUser && (
                    <FollowButton
                      userId={profileUserId}
                      initialIsFollowing={isFollowing}
                      onChange={(nextIsFollowing) => {
                        setFollowersCount((count) =>
                          nextIsFollowing
                            ? count + 1
                            : Math.max(count - 1, 0)
                        );
                      }}
                    />
                  )
                )}
              </div>

              {/* STATS */}
              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#27272A] pt-5">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-bold">{stat.value}</p>
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

      {/* Own profile content */}
      {isOwnProfile && (
        <>
          {/* FAVORITES */}
          <section className="container mx-auto px-6 pb-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
                  Personal picks
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Favorites
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
                {favorites.slice(0, 6).map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.movie?.tmdbId}
                    title={item.movie?.title}
                    year={item.movie?.releaseYear || 'N/A'}
                    rating="N/A"
                    type={toCardType(item.movie?.type)}
                    poster={
                      item.movie?.posterPath
                        ? getTmdbImage(item.movie.posterPath, 'w500')
                        : dummyPoster
                    }
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

          {/* RECENT REVIEWS */}
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
                    username={displayUser.name}
                    avatar={displayUser.avatar}
                    poster={
                      review.movie?.posterPath
                        ? getTmdbImage(review.movie.posterPath, 'w500')
                        : dummyPoster
                    }
                    rating={review.rating}
                    date={formatReviewDate(review.createdAt)}
                    review={review.content}
                    likes={review.likeCount || 0}
                    showPoster
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

          {/* WATCHED */}
          <section className="container mx-auto px-6 pb-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
                  Your viewing history
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Watched
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
                {watched.slice(0, 6).map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.movie?.tmdbId}
                    title={item.movie?.title}
                    year={item.movie?.releaseYear || 'N/A'}
                    rating="N/A"
                    type={toCardType(item.movie?.type)}
                    poster={
                      item.movie?.posterPath
                        ? getTmdbImage(item.movie.posterPath, 'w500')
                        : dummyPoster
                    }
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

          {/* WATCHLIST */}
          <section className="container mx-auto px-6 pb-20">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
                  Saved for later
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Watchlist
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
                {watchlist.slice(0, 6).map((item) => (
                  <MovieCard
                    key={item.id}
                    id={item.movie?.tmdbId}
                    title={item.movie?.title}
                    year={item.movie?.releaseYear || 'N/A'}
                    rating="N/A"
                    type={toCardType(item.movie?.type)}
                    poster={
                      item.movie?.posterPath
                        ? getTmdbImage(item.movie.posterPath, 'w500')
                        : dummyPoster
                    }
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
                  Save movies and series you want to watch later and they will
                  appear here.
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
        </>
      )}

      {/* EDIT PROFILE MODAL */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={currentUser}
          onSave={handleProfileSave}
        />
      )}
    </main>
  );
}

export default PublicProfile;