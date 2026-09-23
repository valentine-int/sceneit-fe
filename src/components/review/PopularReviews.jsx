import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { getPopularReviews } from '../../services/reviewService';
import { getTmdbImage } from '../../utils/tmdbImages';
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

function PopularReviews({ compact = false }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPopularReviews() {
      try {
        setLoading(true);
        setError('');
        const result = await getPopularReviews(5);
        setReviews(result.reviews || []);
      } catch (err) {
        console.error('POPULAR REVIEWS LOAD ERROR:', err);
        setError(err.message || 'Failed to load popular reviews.');
      } finally {
        setLoading(false);
      }
    }
    loadPopularReviews();
  }, []);

  if (loading || error || reviews.length === 0) {
    return null;
  }

  return (
    <section className={`container mx-auto px-6 ${compact ? 'pt-4 pb-16' : 'py-10'}`}>
      <div className="flex items-end justify-between mb-6">
        <div>
          {!compact && (
            <p className="text-xs font-medium uppercase tracking-widest text-[#93939A] mb-2">
              From the community
            </p>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
            Popular Reviews
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            username={review.user?.name || 'User'}
            avatar={review.user?.avatarUrl || profile}
            poster={
              review.movie?.posterPath
                ? getTmdbImage(review.movie.posterPath, 'w500')
                : dummyPoster
            }
            rating={review.rating}
            date={formatReviewDate(review.createdAt)}
            review={review.content}
            likes={review.likeCount || 0}
            showPoster={!compact}
          />
        ))}
      </div>
    </section>
  );
}

export default PopularReviews;