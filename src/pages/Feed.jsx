import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { getFeed } from '../services/feedService';
import { getTmdbImage } from '../utils/tmdbImages';
import dummyPoster from '../assets/Poster1.jpg';
import profile from '../assets/profile.jpg';

function formatTimeAgo(date) {
  if (!date) return '';
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function toDetailPath(movie) {
  return movie?.type === 'series' ? `/series/${movie.id}` : `/movie/${movie.id}`;
}

function FeedItem({ item }) {
  const posterUrl = item.movie?.posterPath
    ? getTmdbImage(item.movie.posterPath, 'w92')
    : dummyPoster;

  const actionText =
    item.type === 'review'
      ? 'reviewed'
      : item.type === 'watchlist'
        ? 'added to watchlist'
        : 'watched';

  return (
    <div className="flex gap-4 rounded-xl border border-[#27272A] bg-[#12141C] p-4 sm:p-5">
      {/* Avatar */}
      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#090A0F]">
        <img
          src={item.user?.avatarUrl || profile}
          alt={item.user?.name || 'User'}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        {/* Header line */}
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          <span className="font-semibold text-[#F4F4F5]">
            {item.user?.name || 'User'}
          </span>
          <span className="text-[#93939A]">{actionText}</span>
          <Link
            to={toDetailPath(item.movie)}
            className="font-medium text-[#F4F4F5] hover:underline"
          >
            {item.movie?.title || 'Untitled'}
          </Link>
        </div>
        <p className="mt-1 text-xs text-[#93939A]">{formatTimeAgo(item.timestamp)}</p>

        {/* Review content, if this is a review activity */}
        {item.type === 'review' && item.review && (
          <div className="mt-3 flex gap-3 rounded-lg border border-[#27272A] bg-[#090A0F] p-3">
            <Link to={toDetailPath(item.movie)} className="w-12 flex-shrink-0">
              <div className="aspect-[2/3] overflow-hidden rounded-md bg-[#12141C]">
                <img src={posterUrl} alt={item.movie?.title} className="h-full w-full object-cover" />
              </div>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <i className="ri-star-fill text-xs text-yellow-400"></i>
                <span className="text-xs font-semibold text-[#F4F4F5]">
                  {item.review.rating}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[#D4D4D8]">
                {item.review.content}
              </p>
              {item.review.containsSpoiler && (
                <p className="mt-1.5 text-xs text-[#93939A]">
                  <i className="ri-alert-line mr-1"></i>
                  Contains spoilers
                </p>
              )}
            </div>
          </div>
        )}

        {/* Poster thumbnail for watchlist/watched activities */}
        {item.type !== 'review' && (
          <Link to={toDetailPath(item.movie)} className="mt-3 flex items-center gap-3">
            <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#090A0F]">
              <img src={posterUrl} alt={item.movie?.title} className="h-full w-full object-cover" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      setLoading(true);
      setError('');
      const result = await getFeed();
      setFeed(result.feed || []);
    } catch (err) {
      console.error('FEED LOAD ERROR:', err);
      setError(err.message || 'Failed to load your feed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
      <section className="container mx-auto max-w-2xl">
        {/* HEADER */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Your network
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Feed</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#93939A]">
            Recent activity from people you follow.
          </p>

            <Link
            to="/users"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#27272A] px-4 py-2 text-sm text-[#F4F4F5] transition hover:bg-[#12141C]"
            >
              <i className="ri-user-search-line"></i>
              Find People
              </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center">
            <i className="ri-loader-4-line animate-spin text-3xl text-[#93939A]"></i>
            <p className="mt-4 text-sm text-[#93939A]">Loading feed...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="py-20 text-center">
            <i className="ri-error-warning-line text-3xl text-[#52525B]"></i>
            <p className="mt-4 text-sm text-[#93939A]">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && feed.length === 0 && (
          <div className="py-20 text-center">
            <i className="ri-group-line text-3xl text-[#52525B]"></i>
            <h3 className="mt-4 text-lg font-semibold">Nothing here yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#93939A]">
              Follow other users to see their activity here — reviews, watchlist
              additions, and titles they've watched.
            </p>
          </div>
        )}

        {/* FEED LIST */}
        {!loading && !error && feed.length > 0 && (
          <div className="flex flex-col gap-4">
            {feed.map((item, index) => (
              <FeedItem key={`${item.type}-${item.movie?.id}-${index}`} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Feed;