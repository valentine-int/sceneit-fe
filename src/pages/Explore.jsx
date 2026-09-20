import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';

import MovieCard from '../components/movie/MovieCard';
import dummyPoster from '../assets/Poster1.jpg';

function Explore() {
  const [search, setSearch] = useState('');

  // Filter yang sedang dipilih user
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Filter yang sudah benar-benar diterapkan
  const [appliedGenre, setAppliedGenre] = useState('');
  const [appliedYear, setAppliedYear] = useState('');
  const [appliedRating, setAppliedRating] = useState('');
  const [appliedType, setAppliedType] = useState('');

  const titles = [
    {
      id: 1,
      title: 'Dune: Part Two',
      year: '2024',
      rating: '8.7',
      genre: 'Sci-Fi',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 2,
      title: 'Interstellar',
      year: '2014',
      rating: '8.7',
      genre: 'Sci-Fi',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 3,
      title: 'Stranger Things',
      year: '2016',
      rating: '8.6',
      genre: 'Sci-Fi',
      type: 'Series',
      poster: dummyPoster
    },
    {
      id: 4,
      title: 'The Batman',
      year: '2022',
      rating: '7.8',
      genre: 'Action',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 5,
      title: 'Breaking Bad',
      year: '2008',
      rating: '9.5',
      genre: 'Crime',
      type: 'Series',
      poster: dummyPoster
    },
    {
      id: 6,
      title: 'Parasite',
      year: '2019',
      rating: '8.5',
      genre: 'Drama',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 7,
      title: 'The Last of Us',
      year: '2023',
      rating: '8.6',
      genre: 'Drama',
      type: 'Series',
      poster: dummyPoster
    },
    {
      id: 8,
      title: 'Oppenheimer',
      year: '2023',
      rating: '8.6',
      genre: 'Drama',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 9,
      title: 'Dark',
      year: '2017',
      rating: '8.7',
      genre: 'Sci-Fi',
      type: 'Series',
      poster: dummyPoster
    },
    {
      id: 10,
      title: 'Spider-Man: Across the Spider-Verse',
      year: '2023',
      rating: '8.6',
      genre: 'Animation',
      type: 'Movie',
      poster: dummyPoster
    },
    {
      id: 11,
      title: 'The Bear',
      year: '2022',
      rating: '8.5',
      genre: 'Drama',
      type: 'Series',
      poster: dummyPoster
    },
    {
      id: 12,
      title: 'Whiplash',
      year: '2014',
      rating: '8.5',
      genre: 'Drama',
      type: 'Movie',
      poster: dummyPoster
    }
  ];

  const filteredTitles = titles.filter((title) => {
    // Search tetap bekerja secara real-time
    const matchesSearch =
      title.title.toLowerCase().includes(search.toLowerCase());

    // Filter bekerja berdasarkan filter yang sudah di-Apply
    const matchesGenre =
      appliedGenre === '' || title.genre === appliedGenre;

    const matchesYear =
      appliedYear === '' || title.year === appliedYear;

    const matchesRating =
      appliedRating === '' ||
      Number(title.rating) >= Number(appliedRating);

    const matchesType =
      appliedType === '' || title.type === appliedType;

    return (
      matchesSearch &&
      matchesGenre &&
      matchesYear &&
      matchesRating &&
      matchesType
    );
  });

  const handleApplyFilters = () => {
    setAppliedGenre(selectedGenre);
    setAppliedYear(selectedYear);
    setAppliedRating(selectedRating);
    setAppliedType(selectedType);
  };

  const handleReset = () => {
    setSearch('');

    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setSelectedType('');

    setAppliedGenre('');
    setAppliedYear('');
    setAppliedRating('');
    setAppliedType('');
  };

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* Page Header */}
      <section className="container mx-auto px-6 pt-32 pb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-[#93939A] mb-2">
          Discover something new
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Explore
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#93939A]">
          Search and discover movies and series based on what you want to watch.
        </p>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-6 pb-10">
        <div className="rounded-2xl border border-[#27272A] bg-[#12141C] p-4 sm:p-5">

          {/* Search */}
          <div className="flex items-center rounded-xl border border-[#27272A] bg-[#090A0F] px-4 py-3.5">
            <i className="ri-search-line mr-3 text-lg text-[#93939A]"></i>

            <input
              type="text"
              placeholder="Search movies & series..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm text-[#F4F4F5] placeholder:text-[#93939A] outline-none"
            />
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5">

            {/* Genre */}
            <select
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Animation">Animation</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Drama">Drama</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
            </select>

            {/* Year */}
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >
              <option value="">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
              <option value="2014">2014</option>
            </select>

            {/* Rating */}
            <select
              value={selectedRating}
              onChange={(event) => setSelectedRating(event.target.value)}
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >
              <option value="">Any Rating</option>
              <option value="9">9+</option>
              <option value="8">8+</option>
              <option value="7">7+</option>
              <option value="6">6+</option>
            </select>

            {/* Type */}
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="rounded-lg border border-[#27272A] bg-[#090A0F] px-3.5 py-2.5 text-sm text-[#93939A] outline-none"
            >
              <option value="">All Types</option>
              <option value="Movie">Movies</option>
              <option value="Series">Series</option>
            </select>

            {/* Apply */}
            <button
              onClick={handleApplyFilters}
              className="rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7]"
            >
              Apply Filters
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="rounded-lg border border-[#27272A] px-4 py-2.5 text-sm font-medium text-[#93939A] transition-colors hover:bg-[#090A0F] hover:text-[#F4F4F5]"
            >
              Reset
            </button>

          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-6 pb-16">

        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#93939A] mb-2">
              Search results
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Discover
            </h2>
          </div>

          <span className="text-xs text-[#93939A]">
            {filteredTitles.length} titles
          </span>
        </div>

        {/* Movie & Series Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
          {filteredTitles.map((title) => (
            <MovieCard
              key={title.id}
              title={title.title}
              year={title.year}
              rating={title.rating}
              type={title.type}
              poster={title.poster}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTitles.length === 0 && (
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
