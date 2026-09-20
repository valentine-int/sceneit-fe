import React from 'react';
import Hero from '../components/layout/Hero';
import MovieGrid from '../components/movie/MovieGrid';
import TopRated from '../components/movie/TopRated';
import PopularReviews from '../components/review/PopularReviews';

function Home() {
  return (
    <main className="bg-[#090A0F] min-h-screen">

      {/* HERO */}
      <Hero />

      {/* TRENDING */}
      <section className="container mx-auto px-6 py-10">

        <div className="flex items-end justify-between mb-6">

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#93939A] mb-2">
              What's popular
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
              Trending Now
            </h2>
          </div>

          <button className="hidden sm:block text-sm font-medium text-[#93939A] hover:text-[#F4F4F5] transition-colors">
            See all
          </button>

        </div>

        <MovieGrid />

      </section>

      {/* TOP RATED */}
      <TopRated />

      <PopularReviews />


    </main>
  );
}

export default Home;
