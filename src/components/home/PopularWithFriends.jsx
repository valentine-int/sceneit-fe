import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFeed } from '../../services/feedService';
import { getTmdbImage } from '../../utils/tmdbImages';
import profile from '../../assets/profile.jpg';
import dummyPoster from '../../assets/Poster1.jpg';

function formatTimestamp(date) {
  if (!date) return '';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '';

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function activityText(item) {
  if (item.type === 'review') return 'reviewed';
  if (item.type === 'watchlist') return 'added to watchlist';
  if (item.type === 'watched') return 'marked as watched';
  return 'did something with';
}

function PopularWithFriends() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFeed() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const result = await getFeed();
        setItems(result.feed || []);
      } catch (err) {
        console.error('POPULAR WITH FRIENDS LOAD ERROR:', err);
        setError(err.message || 'Failed to load activity.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, [user]);

  // Tidak login, belum follow siapa pun, atau error
  if (!user || loading || error || items.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
          From people you follow
        </p>

        <h2 className="text-2xl font-bold sm:text-3xl">
          Popular with Friends
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {items.slice(0, 6).map((item, index) => {
          const detailPath =
            item.movie?.type === 'series'
              ? `/series/${item.movie.tmdbId ?? item.movie.id}`
              : `/movie/${item.movie?.tmdbId ?? item.movie?.id}`;

          return (
            <Link
              key={`${item.type}-${item.movie?.id}-${index}`}
              to={detailPath}
              className="flex gap-5 rounded-xl border border-[#27272A] bg-[#12141C] p-5 transition-colors hover:bg-[#1A1C24]"
            >
              <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md bg-[#090A0F]">
                <img
                  src={
                    item.movie?.posterPath
                      ? getTmdbImage(item.movie.posterPath, 'w185')
                      : dummyPoster
                  }
                  alt={item.movie?.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <img
                    src={item.user?.avatarUrl || profile}
                    alt={item.user?.name}
                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                  />

                  <p className="truncate text-sm">
                    <span className="font-semibold text-[#F4F4F5]">
                      {item.user?.name}
                    </span>{' '}
                    <span className="text-[#A1A1AA]">
                      {activityText(item)}
                    </span>{' '}
                    <span className="font-semibold text-[#F4F4F5]">
                      {item.movie?.title}
                    </span>
                  </p>
                </div>

                <p className="mt-1 text-xs text-[#71717A]">
                  {formatTimestamp(item.timestamp)}
                </p>

                {item.type === 'review' && item.review?.content && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#A1A1AA]">
                    "{item.review.content}"
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default PopularWithFriends;