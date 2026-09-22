import React, { useRef } from 'react';
import { getTmdbImage } from '../utils/tmdbImages';

import MovieCard from '../components/movie/MovieCard';
import useSeries from '../hooks/useSeries';
import dummyPoster from '../assets/Poster1.jpg';

function Series() {

  const {
    data,
    loading,
    error,
  } = useSeries();

  console.log('SERIES DATA:', data);

  const trendingSeries = data?.trending?.results || [];
  const popularSeries = data?.popular?.results || [];
  const topRatedSeries = data?.topRated?.results || [];
  const airingTodaySeries = data?.airingToday?.results || [];

  const trendingRef = useRef(null);
  const popularRef = useRef(null);
  const topRatedRef = useRef(null);
  const airingTodayRef = useRef(null);

  const scrollCarousel = (ref, direction) => {
    ref.current?.scrollBy({
      left: direction === 'left' ? -900 : 900,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
        <section className="container mx-auto">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Discover
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Series
          </h1>

          <p className="mt-3 text-sm text-[#93939A]">
            Loading series...
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
              We couldn't load the series right now. Please try again later.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const hasSeries =
    trendingSeries.length > 0 ||
    popularSeries.length > 0 ||
    topRatedSeries.length > 0 ||
    airingTodaySeries.length > 0;

  if (!hasSeries) {
    return (
      <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
        <section className="container mx-auto text-center">
          <i className="ri-tv-line text-3xl text-[#52525B]"></i>

          <h1 className="mt-4 text-2xl font-bold">
            No series found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#93939A]">
            There are no series available right now.
          </p>
        </section>
      </main>
    );
  }

const renderSeriesCard = (series) => (
  <div
    key={series.tmdbId}
    className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px]"
  >
    <MovieCard
      id={series.tmdbId}
      title={series.title}
      year={series.releaseYear || 'N/A'}
      rating={
        series.rating !== null &&
        series.rating !== undefined
          ? Number(series.rating).toFixed(1)
          : 'N/A'
      }
      poster={
        getTmdbImage(series.posterPath, 'w500') ||
        dummyPoster
      }
      type="Series"
    />
  </div>
);

  const renderSeriesSection = (title, series, ref) => {

    if (series.length === 0) {
      return null;
    }

    return (
      <section className="mt-14">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            type="button"
            className="text-2xl text-[#93939A] transition-colors hover:text-[#F4F4F5]"
            aria-label={`View all ${title}`}
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>

        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              scrollCarousel(ref, 'left')
            }
            className="shrink-0 text-3xl text-[#F4F4F5] transition-transform hover:scale-125"
            aria-label={`Previous ${title}`}
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>

          <div
            ref={ref}
            className="flex min-w-0 gap-5 overflow-x-auto pb-2
                       [scrollbar-width:none]
                       [-ms-overflow-style:none]
                       [&::-webkit-scrollbar]:hidden"
          >
            {series.map(renderSeriesCard)}
          </div>

          <button
            type="button"
            onClick={() =>
              scrollCarousel(ref, 'right')
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

  return (
    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">

      <section className="container mx-auto">

        {/* HEADER */}
        <div>

          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Discover
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Series
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
            Discover series worth watching.
          </p>

        </div>

        {/* TRENDING */}
        {renderSeriesSection(
          'Trending Series',
          trendingSeries,
          trendingRef
        )}

        {/* POPULAR */}
        {renderSeriesSection(
          'Popular Series',
          popularSeries,
          popularRef
        )}

        {/* TOP RATED */}
        {renderSeriesSection(
          'Top Rated Series',
          topRatedSeries,
          topRatedRef
        )}

        {/* AIRING TODAY */}
        {renderSeriesSection(
          'Airing Today',
          airingTodaySeries,
          airingTodayRef
        )}

      </section>

    </main>
  );
}

export default Series;