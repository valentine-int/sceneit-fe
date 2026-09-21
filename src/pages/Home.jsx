import React from 'react';

import Hero from '../components/layout/Hero';
import MovieGrid from '../components/movie/MovieGrid';
import TopRated from '../components/movie/TopRated';
import PopularReviews from '../components/review/PopularReviews';

import useHome from '../hooks/useHome';

function Home() {

  const {
    data,
    loading,
    error,
  } = useHome();

  const trendingMovies = data?.trending?.results || [];
  const topRatedMovies = data?.topRated?.results || [];
  const featuredMovies = data?.featured || [];

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
        <section className="container mx-auto">

          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            SceneIt
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Discover
          </h1>

          <p className="mt-3 text-sm text-[#93939A]">
            Loading your movie experience...
          </p>

        </section>
      </main>
    );
  }

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
              We couldn't load the homepage right now. Please try again later.
            </p>

          </div>

        </section>
      </main>
    );
  }

  const hasHomeData =
    trendingMovies.length > 0 ||
    topRatedMovies.length > 0 ||
    featuredMovies.length > 0;

  if (!hasHomeData) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
        <section className="container mx-auto text-center">

          <i className="ri-film-line text-3xl text-[#52525B]"></i>

          <h1 className="mt-4 text-2xl font-bold">
            Nothing to discover
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#93939A]">
            There is no movie content available right now.
          </p>

        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* HERO */}
      {featuredMovies.length > 0 && (
        <Hero movies={featuredMovies} />
      )}

      {/* TRENDING MOVIES */}
      {trendingMovies.length > 0 && (
        <MovieGrid
          movies={trendingMovies}
        />
      )}

      {/* TOP RATED */}
      {topRatedMovies.length > 0 && (
        <TopRated
          movies={topRatedMovies}
        />
      )}

      {/* POPULAR REVIEWS */}
      <PopularReviews />

    </main>
  );
}

export default Home;