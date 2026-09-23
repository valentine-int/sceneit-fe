import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import ReviewCard from '../../components/review/ReviewCard';
import { getMyReviews, deleteReview, updateReview} from '../../services/reviewService';
import ReviewModal from '../../components/review/ReviewModal';
import { getTmdbImage } from '../../utils/tmdbImages';
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

function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      setError('');
      const result = await getMyReviews();
      setReviews(result.reviews || []);
    } catch (err) {
      console.error('MY REVIEWS LOAD ERROR:', err);
      setError(err.message || 'Failed to load your reviews.');
    } finally {
      setLoading(false);
    }
  }

  const handleEditPublish = async ({ rating, reviewText, containsSpoiler }) => {
  await updateReview(editingReview.id, {
    rating,
    content: reviewText,
    containsSpoiler,
  });
  await loadReviews(); // refresh list dengan data terbaru
  setEditingReview(null);
};

  const handleDelete = async (reviewId) => {
    if (deletingId) return;
    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      setReviews((current) => current.filter((review) => review.id !== reviewId));
    } catch (err) {
      console.error('MY REVIEWS DELETE ERROR:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
      <section className="container mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Your activity
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Reviews
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
            All the reviews you've written so far.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center">
            <i className="ri-loader-4-line animate-spin text-3xl text-[#93939A]"></i>
            <p className="mt-4 text-sm text-[#93939A]">Loading your reviews...</p>
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
        {!loading && !error && reviews.length === 0 && (
          <div className="py-20 text-center">
            <i className="ri-chat-3-line text-3xl text-[#52525B]"></i>
            <p className="mt-4 text-sm text-[#93939A]">
              You haven't written any reviews yet.
            </p>
          </div>
        )}

        {/* LIST */}
        {!loading && !error && reviews.length > 0 && (
          <div className="max-w-3xl space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="relative">
                <ReviewCard
                  username={review.movie?.title || 'Untitled'}
                  avatar={
                    review.movie?.posterPath
                      ? getTmdbImage(review.movie.posterPath, 'w92')
                      : dummyPoster
                  }
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
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReview(review)}
                    className="flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#090A0F]/80 px-2.5 py-1.5 text-xs text-[#93939A] backdrop-blur-sm transition-colors hover:border-[#F4F4F5]/50 hover:text-[#F4F4F5]"
                  >
                    <i className="ri-edit-line"></i>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#090A0F]/80 px-2.5 py-1.5 text-xs text-[#93939A] backdrop-blur-sm transition-colors hover:border-red-400/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <i className="ri-delete-bin-line"></i>
                    {deletingId === review.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
                {review.containsSpoiler && (
                  <p className="mt-2 text-xs text-[#93939A]">
                    <i className="ri-alert-line mr-1"></i>
                    Contains spoilers
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <ReviewModal
      isOpen={Boolean(editingReview)}
      onClose={() => setEditingReview(null)}
      onPublish={handleEditPublish}
      movie={{
        title: editingReview?.movie?.title,
        year: editingReview?.movie?.releaseYear,
        poster: editingReview?.movie?.posterPath
          ? getTmdbImage(editingReview.movie.posterPath, 'w500')
          : dummyPoster,
      }}
      initialReview={
        editingReview
          ? {
              rating: editingReview.rating,
              content: editingReview.content,
              containsSpoiler: editingReview.containsSpoiler,
            }
          : null
      }
    />
    </main>
  );
}

export default MyReviews;