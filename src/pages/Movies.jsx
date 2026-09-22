import React, { useRef } from 'react';

import MovieCard from '../components/movie/MovieCard';
import useMovies from '../hooks/useMovies';
import { getTmdbImage } from '../utils/tmdbImages';

function Movies() {

  // =========================
  // MOVIE DATA
  // =========================

  const {
    data,
    loading,
    error,
  } = useMovies();

  const trendingMovies = data?.trending?.results || [];
  const popularMovies = data?.popular?.results || [];
  const topRatedMovies = data?.topRated?.results || [];
  const nowPlayingMovies = data?.nowPlaying?.results || [];

  // =========================
  // CAROUSEL REFS
  // =========================

  const trendingRef = useRef(null);
  const popularRef = useRef(null);
  const topRatedRef = useRef(null);
  const nowPlayingRef = useRef(null);

  // =========================
  // CAROUSEL
  // =========================

  const scrollCarousel = (ref, direction) => {

    ref.current?.scrollBy({
      left: direction === 'left' ? -900 : 900,
      behavior: 'smooth',
    });

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">

        <section className="container mx-auto">

          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Discover
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Movies
          </h1>

          <p className="mt-3 text-sm text-[#93939A]">
            Loading movies...
          </p>

        </section>

      </main>
    );

  }

  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">

        <section className="container mx-auto">

          <div className="max-w-md">

            <i className="ri-error-warning-line text-3xl text-[#52525B]"></i>

            <h1 className="mt-4 text-2xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#93939A]">
              We couldn't load the movies right now. Please try again later.
            </p>

          </div>

        </section>

      </main>
    );

  }

  // =========================
  // EMPTY STATE
  // =========================

  const hasMovies =
    trendingMovies.length > 0 ||
    popularMovies.length > 0 ||
    topRatedMovies.length > 0 ||
    nowPlayingMovies.length > 0;

  if (!hasMovies) {

    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">

        <section className="container mx-auto text-center">

          <i className="ri-film-line text-3xl text-[#52525B]"></i>

          <h1 className="mt-4 text-2xl font-bold">
            No movies found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#93939A]">
            There are no movies available right now.
          </p>

        </section>

      </main>
    );

  }

  // =========================
  // MOVIE CARD
  // =========================

 const renderMovieCard = (movie) => (

  <div
    key={movie.tmdbId}
    className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px]"
  >

    <MovieCard
      id={movie.tmdbId}

      title={movie.title}

      year={movie.releaseYear || 'N/A'}

      rating={
        movie.rating !== null &&
        movie.rating !== undefined
          ? Number(movie.rating).toFixed(1)
          : 'N/A'
      }

      poster={
        getTmdbImage(movie.posterPath, 'w500') ||
        '/dummyPoster.png'
      }

      type="Movie"
    />

  </div>

);

  // =========================
  // SECTION COMPONENT
  // =========================

  const renderMovieSection = (
    title,
    movies,
    ref
  ) => {

    if (movies.length === 0) {
      return null;
    }

    return (

      <section className="mt-14">

        {/* HEADER */}

        <div className="mb-6" >

          <h2 className="text-2xl font-bold">
            {title}
          </h2>
          
        </div>


        {/* CAROUSEL */}

        <div className="flex items-center gap-3">

          {/* LEFT */}

          <button
            type="button"
            onClick={() =>
              scrollCarousel(
                ref,
                'left'
              )
            }
            className="shrink-0 text-3xl text-[#F4F4F5] transition-transform hover:scale-125"
            aria-label={`Previous ${title}`}
          >

            <i className="ri-arrow-left-s-line"></i>

          </button>


          {/* MOVIES */}

          <div
            ref={ref}
            className="flex min-w-0 gap-5 overflow-x-auto pb-2
                       [scrollbar-width:none]
                       [-ms-overflow-style:none]
                       [&::-webkit-scrollbar]:hidden"
          >

            {movies.map(renderMovieCard)}

          </div>


          {/* RIGHT */}

          <button
            type="button"
            onClick={() =>
              scrollCarousel(
                ref,
                'right'
              )
            }
            className="shrink-0 text-3xl text-[#F4F4F5] transition-transform hover:scale-125"
            aria-label={`Next ${title}`}
          >

            <i className="ri-arrow-right-s-line"></i>

          </button>

        </div>

      </section>

    );

  };

  // =========================
  // PAGE
  // =========================

  return (

    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">

      <section className="container mx-auto">

        {/* HEADER */}

        <div>

          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Discover
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Movies
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
            Discover movies worth watching.
          </p>

        </div>


        {/* TRENDING */}

        {renderMovieSection(
          'Trending Movies',
          trendingMovies,
          trendingRef
        )}


        {/* POPULAR */}

        {renderMovieSection(
          'Popular Movies',
          popularMovies,
          popularRef
        )}


        {/* TOP RATED */}

        {renderMovieSection(
          'Top Rated Movies',
          topRatedMovies,
          topRatedRef
        )}


        {/* NOW PLAYING */}

        {renderMovieSection(
          'Now Playing',
          nowPlayingMovies,
          nowPlayingRef
        )}

      </section>

    </main>

  );

}

export default Movies;