import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { getTmdbReviews } from '../../services/movieService';
import profile from '../../assets/profile.jpg';

const TMDB_AVATAR_BASE = 'https://image.tmdb.org/t/p/w200';

function resolveAvatar(avatarPath) {
  if (!avatarPath) return profile;
  if (avatarPath.startsWith('/http')) {
    return avatarPath.slice(1); // TMDB kadang simpan URL eksternal penuh dgn leading slash
  }
  return `${TMDB_AVATAR_BASE}${avatarPath}`;
}

function formatTmdbDate(date) {
  if (!date) return 'N/A';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'N/A';
  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function TmdbReviews({ tmdbId, type = 'movie' }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTmdbReviews() {
      if (!tmdbId) {
        setReviews([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const result = await getTmdbReviews(tmdbId, type);
        setReviews(result.results || []);
      } catch (err) {
        console.error('TMDB REVIEWS LOAD ERROR:', err);
        setError(err.message || 'Failed to load TMDB reviews.');
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    loadTmdbReviews();
  }, [tmdbId, type]);

  if (loading || error || reviews.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 pb-16">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
          From around the web
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Reviews from TMDB</h2>
      </div>
      <div className="w-full space-y-4">
        {reviews.slice(0, 5).map((review) => (
          <ReviewCard
            key={review.id}
            username={review.author || 'TMDB User'}
            avatar={resolveAvatar(review.avatarPath)}
            rating={review.rating !== null && review.rating !== undefined ? Number(review.rating).toFixed(1) : 'N/A'}
            date={formatTmdbDate(review.createdAt)}
            review={review.content}
            likes={0}
            showPoster={false}
            hideLike
          />
        ))}
      </div>
    </section>
  );
}

export default TmdbReviews;