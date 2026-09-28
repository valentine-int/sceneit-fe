import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import useSimilarSeries from '../../hooks/useSimilarSeries';
import { getTmdbImage } from '../../utils/tmdbImages';
import dummyPoster from '../../assets/Poster1.jpg';

function SimilarSeries({ seriesId }) {
  const { data, loading, error } = useSimilarSeries(seriesId);
  const series = data || [];

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction === 'left' ? -900 : 900,
      behavior: 'smooth',
    });
  };

  // LOADING
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

  // ERROR
  if (error) {
    return null;
  }

  // EMPTY
  if (series.length === 0) {
    return null;
  }

  // PAGE
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

      <div className="flex items-center gap-3">
        {/* LEFT */}
        <button
          type="button"
          onClick={() => scrollCarousel('left')}
          className="shrink-0 text-3xl text-[#F4F4F5] transition-transform hover:scale-125"
          aria-label="Previous similar series"
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>

        {/* SERIES */}
        <div
          ref={carouselRef}
          className="flex min-w-0 gap-5 overflow-x-auto pb-2
                     [scrollbar-width:none]
                     [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
        >
          {series.slice(0, 10).map((item) => (
            <div
              key={item.tmdbId}
              className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px]"
            >
              <MovieCard
                id={item.tmdbId}
                title={item.title}
                year={item.releaseYear || 'N/A'}
                rating={
                  item.rating !== null && item.rating !== undefined
                    ? Number(item.rating).toFixed(1)
                    : 'N/A'
                }
                poster={
                  item.posterPath
                    ? getTmdbImage(item.posterPath, 'w500')
                    : dummyPoster
                }
                type="Series"
              />
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <button
          type="button"
          onClick={() => scrollCarousel('right')}
          className="shrink-0 text-3xl text-[#F4F4F5] transition-transform hover:scale-125"
          aria-label="Next similar series"
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </section>
  );
}

export default SimilarSeries;