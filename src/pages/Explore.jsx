import React from 'react';
import 'remixicon/fonts/remixicon.css';

import MovieCard from '../components/movie/MovieCard';
import useExplore from '../hooks/useExplore';
import { getTmdbImage } from '../utils/tmdbImages';
import dummyPoster from '../assets/Poster1.jpg';

function Explore() {

  const {
    search,
    setSearch,

    type,
    setType,

    genre,
    setGenre,

    year,
    setYear,

    rating,
    setRating,

    availableGenres,

    results,

    loading,
    error,

    handleSearch,
    handleReset,
  } = useExplore();

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* =========================
          HEADER
      ========================= */}

      <section className="container mx-auto px-6 pb-8 pt-32">

        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
          Discover something new
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
          Search and discover movies and series based on what you want to watch.
        </p>

      </section>

      {/* =========================
          SEARCH & FILTER
      ========================= */}

      <section className="container mx-auto px-6 pb-10">

        <div className="rounded-2xl border border-[#27272A] bg-[#12141C] p-4 sm:p-5">

          {/* SEARCH */}

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#27272A] bg-[#090A0F] px-4 py-3.5">

              <i className="ri-search-line mr-3 flex-shrink-0 text-lg text-[#93939A]"></i>

              <input
                type="text"
                placeholder="Search movies & series..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onKeyDown={(event) => {

                  if (event.key === 'Enter') {
                    handleSearch();
                  }

                }}
                className="w-full bg-transparent text-sm text-[#F4F4F5] outline-none placeholder:text-[#93939A]"
              />

            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-lg bg-[#F4F4F5] px-5 py-3 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7] sm:py-2"
            >
              Search
            </button>

          </div>

          {/* FILTERS */}

          <div className="mt-4 flex flex-wrap items-center gap-3">

            {/* TYPE */}

            <select
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                setGenre('');
              }}
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >

              <option value="">
                All Types
              </option>

              <option value="movie">
                Movies
              </option>

              <option value="series">
                Series
              </option>

            </select>

            {/* GENRE */}

            <select
              value={genre}
              onChange={(event) =>
                setGenre(event.target.value)
              }
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >

              <option value="">
                All Genres
              </option>

              {availableGenres.map((item) => (

                <option
                  key={`${item.type}-${item.id}`}
                  value={item.id}
                >
                  {item.name}
                </option>

              ))}

            </select>

            {/* YEAR */}

            <select
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >

              <option value="">
                All Years
              </option>

              {Array.from(
                { length: 15 },
                (_, index) => 2026 - index
              ).map((itemYear) => (

                <option
                  key={itemYear}
                  value={itemYear}
                >
                  {itemYear}
                </option>

              ))}

            </select>

            {/* RATING */}

            <select
              value={rating}
              onChange={(event) =>
                setRating(event.target.value)
              }
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >

              <option value="">
                Any Rating
              </option>

              <option value="9">
                9+
              </option>

              <option value="8">
                8+
              </option>

              <option value="7">
                7+
              </option>

              <option value="6">
                6+
              </option>

            </select>

            {/* RESET */}

            <button
              type="button"
              onClick={handleReset}
              className="py-2 text-sm text-[#93939A] transition-colors hover:text-[#F4F4F5]"
            >
              Reset
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          RESULTS
      ========================= */}

      <section className="container mx-auto px-6 pb-16">

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
              Search results
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Discover
            </h2>

          </div>

          {search && (
            <span className="text-xs text-[#93939A]">
              {results.length} titles
            </span>
          )}

        </div>

        {/* LOADING */}

        {loading && (

          <p className="py-10 text-sm text-[#93939A]">
            Searching...
          </p>

        )}

        {/* ERROR */}

        {error && (

          <p className="py-10 text-sm text-red-400">
            {error}
          </p>

        )}

        {/* RESULTS */}

        {!loading &&
          !error &&
          results.length > 0 && (

            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

              {results.map((item) => (

                <div
                  key={`${item.type}-${item.tmdbId}`}
                  className="w-full"
                >

                  <MovieCard
                    id={item.tmdbId}
                    title={item.title}
                    year={item.releaseYear || 'N/A'}
                    rating={
                      item.rating !== null &&
                      item.rating !== undefined
                        ? Number(item.rating).toFixed(1)
                        : 'N/A'
                    }
                    poster={
                      item.posterPath
                        ? getTmdbImage(
                            item.posterPath,
                            'w500'
                          )
                        : dummyPoster
                    }
                    type={
                      item.type === 'movie'
                        ? 'Movie'
                        : 'Series'
                    }
                  />

                </div>

              ))}

            </div>

          )}

        {/* NO RESULTS */}

        {!loading &&
          !error &&
          search &&
          results.length === 0 && (

            <div className="py-20 text-center">

              <i className="ri-search-line text-3xl text-[#52525B]"></i>

              <p className="mt-4 text-sm text-[#93939A]">
                No movies or series found.
              </p>

            </div>

          )}

      </section>

    </main>
  );
}

export default Explore;
