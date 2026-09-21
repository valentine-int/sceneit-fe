import React from 'react';

import MovieCard from './MovieCard';

import useSimilarSeries from '../../hooks/useSimilarSeries';


function SimilarSeries({ seriesId }) {

  const {
    data,
    loading,
    error,
  } = useSimilarSeries(seriesId);

  const series = data || [];


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <section className="container mx-auto px-6 pb-16">

        <div className="mb-6">

          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Discover
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Similar Series
          </h2>

        </div>

        <p className="text-sm text-[#93939A]">
          Loading similar series...
        </p>

      </section>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return null;

  }


  // =========================
  // EMPTY
  // =========================

  if (series.length === 0) {
    return null;
  }


  // =========================
  // PAGE
  // =========================

  return (

    <section className="container mx-auto px-6 pb-16">

      <div className="mb-6">

        <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
          Discover
        </p>

        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          Similar Series
        </h2>

      </div>


      <div
        className="flex gap-5 overflow-x-auto pb-3
                   [scrollbar-width:none]
                   [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden"
      >

        {series
          .slice(0, 10)
          .map((item) => (

            <div
              key={item.id}
              className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px]"
            >

              <MovieCard
                id={item.id}
                title={item.name}
                year={
                  item.first_air_date
                    ? item.first_air_date.slice(0, 4)
                    : 'N/A'
                }
                rating={
                  item.vote_average
                    ? item.vote_average.toFixed(1)
                    : 'N/A'
                }
                poster={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : '/dummyPoster.png'
                }
                type="Series"
              />

            </div>

          ))}

      </div>

    </section>

  );
}


export default SimilarSeries;