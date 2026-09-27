import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getFeaturedList,
  createFeatured,
  removeFeatured,
} from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { getTmdbImage } from '../../utils/tmdbImages';
import dummyPoster from '../../assets/Poster1.jpg';

function AdminFeatured() {
  const { showToast } = useToast();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [tmdbId, setTmdbId] = useState('');
  const [type, setType] = useState('movie');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const loadFeatured = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getFeaturedList();
      setFeatured(result.featured || []);
    } catch (err) {
      console.error('ADMIN FEATURED LOAD ERROR:', err);
      setError(err.message || 'Failed to load featured content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!tmdbId.trim()) {
      setFormError('TMDB ID is required.');
      return;
    }
    if (featured.length >= 5) {
      setFormError('Maximum of 5 Featured Content reached. Remove one first.');
      return;
    }
    try {
      setFormError('');
      setIsSubmitting(true);
      await createFeatured({ tmdbId: Number(tmdbId), type });
      setTmdbId('');
      showToast('Featured content added.', 'success');
      await loadFeatured();
    } catch (err) {
      console.error('ADMIN ADD FEATURED ERROR:', err);
      setFormError(err.message || 'Failed to add featured content.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // NOTE: id di sini adalah featuredId (ID baris featuredContent),
  // bukan ID movie lokal. Dipakai khusus untuk operasi CRUD featured
  // (remove/update), bukan untuk watchlist/favorite/review.
  const handleRemove = async (featuredId) => {
    if (removingId) return;
    if (!window.confirm('Remove this from Featured Content?')) return;
    try {
      setRemovingId(featuredId);
      await removeFeatured(featuredId);
      setFeatured((current) => current.filter((f) => f.featuredId !== featuredId));
      showToast('Removed from Featured Content.', 'success');
    } catch (err) {
      console.error('ADMIN REMOVE FEATURED ERROR:', err);
      showToast(err.message || 'Failed to remove.', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AdminLayout title="Featured Content">
      {/* FORM ADD */}
      <form
        onSubmit={handleAdd}
        className="mb-8 rounded-xl border border-[#27272A] bg-[#12141C] p-5"
      >
        <p className="mb-1 text-sm font-semibold text-[#F4F4F5]">Add Featured Content</p>
        <p className="mb-4 text-xs text-[#93939A]">
          Enter the TMDB ID of a movie or series. It will appear in the Home Hero section
          ({featured.length}/5 used).
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="number"
            value={tmdbId}
            onChange={(e) => setTmdbId(e.target.value)}
            placeholder="TMDB ID (e.g. 550)"
            className="flex-1 rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4F4F5] outline-none"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#F4F4F5] outline-none sm:w-36"
          >
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting || featured.length >= 5}
            className="rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#D4D4D8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
        {formError && <p className="mt-3 text-xs text-red-400">{formError}</p>}
      </form>

      {/* LIST */}
      {loading && (
        <div className="py-16 text-center text-sm text-[#93939A]">
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Loading featured content...
        </div>
      )}

      {!loading && error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && featured.length === 0 && (
        <div className="py-16 text-center text-sm text-[#93939A]">
          <i className="ri-star-line mb-2 block text-3xl text-[#52525B]"></i>
          No featured content yet. Add one above.
        </div>
      )}

      {!loading && !error && featured.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {featured.map((item) => (
            <div
              key={item.featuredId}
              className="group relative overflow-hidden rounded-xl border border-[#27272A] bg-[#12141C]"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-[#090A0F]">
                <img
                  src={item.posterPath ? getTmdbImage(item.posterPath, 'w342') : dummyPoster}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-[#F4F4F5]">{item.title}</p>
                <p className="text-[10px] uppercase tracking-wide text-[#71717A]">{item.type}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(item.featuredId)}
                disabled={removingId === item.featuredId}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-red-400 opacity-0 transition-opacity hover:bg-black/90 group-hover:opacity-100 disabled:opacity-100"
                aria-label="Remove from featured"
              >
                <i className={removingId === item.featuredId ? 'ri-loader-4-line animate-spin' : 'ri-close-line'}></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminFeatured;
