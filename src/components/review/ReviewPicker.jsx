import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';

import { searchMulti } from '../../services/tmdb';
import { getTmdbImage } from '../../utils/tmdbImages';


function ReviewPicker({
  isOpen,
  onClose,
  onSelect,
}) {

  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);


  // =========================
  // SEARCH TMDB
  // =========================

  useEffect(() => {

    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {

      try {

        setLoading(true);

        const data = await searchMulti(search);

        const filteredResults =
          (data.results || [])
            .filter((item) => (
              item.media_type === 'movie' ||
              item.media_type === 'tv'
            ))
            .slice(0, 8);

        setResults(filteredResults);

      } catch (error) {

        console.error(
          'REVIEW PICKER SEARCH ERROR:',
          error
        );

        setResults([]);

      } finally {

        setLoading(false);

      }

    }, 400);

    return () => clearTimeout(timer);

  }, [search]);


  // =========================
  // RESET WHEN CLOSED
  // =========================

  useEffect(() => {

    if (!isOpen) {
      setSearch('');
      setResults([]);
    }

  }, [isOpen]);


  // =========================
  // SELECT TITLE
  // =========================

  const handleSelect = (item) => {

    onSelect(item);

    setSearch('');
    setResults([]);

  };


  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

      <div className="relative w-full max-w-lg rounded-2xl bg-[#F4F4F5] p-6 text-[#090A0F] shadow-2xl">

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-[#71717A] transition-colors hover:text-[#090A0F]"
          aria-label="Close review picker"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>


        {/* HEADER */}

        <div className="pr-10">

          <h2 className="text-2xl font-bold">
            Write a Review
          </h2>

          <p className="mt-1 text-sm text-[#71717A]">
            Search for a movie or series you want to review.
          </p>

        </div>


        {/* SEARCH */}

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#D4D4D8] bg-white px-4 py-3">

          <i className="ri-search-line text-lg text-[#71717A]"></i>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            autoFocus
            placeholder="Search movies & series..."
            className="w-full bg-transparent text-sm text-[#090A0F] placeholder:text-[#A1A1AA] outline-none"
          />

        </div>


        {/* RESULTS */}

        <div className="mt-4 max-h-80 overflow-y-auto">

          {/* LOADING */}

          {loading && (

            <div className="py-10 text-center">

              <i className="ri-loader-4-line animate-spin text-2xl text-[#71717A]"></i>

              <p className="mt-2 text-sm text-[#71717A]">
                Searching...
              </p>

            </div>

          )}


          {/* RESULTS */}

          {!loading && results.length > 0 && (

            <div className="space-y-1">

              {results.map((item) => {

                const title =
                  item.media_type === 'movie'
                    ? item.title
                    : item.name;

                const year =
                  item.media_type === 'movie'
                    ? item.release_date?.slice(0, 4)
                    : item.first_air_date?.slice(0, 4);

                const type =
                  item.media_type === 'movie'
                    ? 'Movie'
                    : 'Series';

                return (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[#E4E4E7]"
                  >

                    {/* POSTER */}

                    <div className="h-16 w-11 flex-shrink-0 overflow-hidden rounded-md bg-[#E4E4E7]">

                      {item.poster_path ? (

                        <img
                          src={getTmdbImage(
                            item.poster_path,
                            'w92'
                          )}
                          alt={title}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center">
                          <i className="ri-movie-2-line text-[#A1A1AA]"></i>
                        </div>

                      )}

                    </div>


                    {/* INFO */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-[#090A0F]">
                        {title}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-[#71717A]">

                        <span>
                          {year || 'N/A'}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {type}
                        </span>

                      </div>

                    </div>


                    <i className="ri-arrow-right-s-line text-[#A1A1AA]"></i>

                  </button>
                );

              })}

            </div>

          )}


          {/* NO RESULTS */}

          {!loading &&
            search.trim() &&
            results.length === 0 && (

              <div className="py-10 text-center">

                <i className="ri-search-line text-2xl text-[#A1A1AA]"></i>

                <p className="mt-2 text-sm text-[#71717A]">
                  No movies or series found.
                </p>

              </div>

            )}


          {/* INITIAL */}

          {!loading &&
            !search.trim() && (

              <div className="py-10 text-center">

                <i className="ri-movie-2-line text-2xl text-[#A1A1AA]"></i>

                <p className="mt-2 text-sm text-[#71717A]">
                  Search for a title to start your review.
                </p>

              </div>

            )}

        </div>

      </div>

    </div>
  );
}


export default ReviewPicker;