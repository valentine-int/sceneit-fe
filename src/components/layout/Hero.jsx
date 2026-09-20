import React from 'react';
import 'remixicon/fonts/remixicon.css';
import Button from '../common/Button';
import Badge from '../common/Badge';

function Hero() {

  const featuredMovie = {
    title: "Dune: Part Two",
    rating: "8.7",
    year: "2024",
    genre: "Sci-Fi",
    duration: "2h 46m",
    type: "Movie",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    background:
      "https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"
  };

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#090A0F] text-[#F4F4F5]">

      {/* BACKGROUND */}
      <img
        src={featuredMovie.background}
        alt={featuredMovie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/80 to-[#090A0F]/20" />

      {/* BOTTOM FADE */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090A0F] to-transparent" />

      {/* CONTENT */}
      <div className="relative container mx-auto px-6 pt-36 pb-24 sm:pt-40 sm:pb-28">

        <div className="max-w-2xl">

          {/* TYPE */}
          <div className="mb-2">
            <Badge>{featuredMovie.type}</Badge>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {featuredMovie.title}
          </h1>

          {/* META */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">

            <div className="flex items-center gap-1.5">
              <i className="ri-star-fill text-yellow-400"></i>
              <span className="font-semibold text-[#F4F4F5]">
                {featuredMovie.rating}
              </span>
            </div>

            <span className="text-[#93939A]">
              {featuredMovie.year}
            </span>

            <span className="text-[#52525B]">•</span>

            <span className="text-[#93939A]">
              {featuredMovie.genre}
            </span>

            <span className="text-[#52525B]">•</span>

            <span className="text-[#93939A]">
              {featuredMovie.duration}
            </span>

          </div>

          {/* DESCRIPTION */}
          <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[#D4D4D8]">
            {featuredMovie.description}
          </p>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-wrap items-center gap-3">

            <Button>
              <i className="ri-add-line text-base"></i>
              Review
            </Button>

            <Button variant="ghost">
              <i className="ri-bookmark-line text-base"></i>
              Watchlist
            </Button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;