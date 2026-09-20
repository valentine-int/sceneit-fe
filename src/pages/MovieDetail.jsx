import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';

import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import PopularReviews from '../components/review/PopularReviews';
import SimilarMovies from '../components/movie/SimilarMovies';
import ReviewModal from '../components/review/ReviewModal';

import profile from '../assets/profile.jpg';


function MovieDetail() {
  const movie = {
    title: 'The Call',
    year: '2020',
    type: 'Movie',
    genre: 'Thriller',
    duration: '1h 52m',
    director: 'Lee Chung-hyun',
    country: 'South Korea',
    rating: '4.8',
    backdrop: 'https://image.tmdb.org/t/p/original/A5PqaIFgV8Xy3dYhZJbJY9eV6K.jpg',
    description:
      'A mysterious phone call connects two women living in different times, changing the course of their lives as they uncover a dark secret.',
  };

  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const cast = [
    {
      id: 1,
      name: 'Park Shin-hye',
      role: 'Seo-yeon',
      image: profile,
    },
    {
      id: 2,
      name: 'Jeon Jong-seo',
      role: 'Young-sook',
      image: profile,
    },
    {
      id: 3,
      name: 'Kim Sung-ryoung',
      role: 'Seo-yeon’s Mother',
      image: profile,
    },
    {
      id: 4,
      name: 'Lee El',
      role: 'Young-sook’s Mother',
      image: profile,
    },
    {
      id: 5,
      name: 'Park Ho-san',
      role: 'Seo-yeon’s Father',
      image: profile,
    },
  ];

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#F4F4F5]">

      {/* Backdrop */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/70 to-[#090A0F]/10" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F]/70 to-transparent" />
      </section>

      {/* Movie Information */}
      <section className="container mx-auto px-6">
        <div className="-mt-24 relative z-10 max-w-4xl">

          {/* Title */}
          <div>
            <Badge>{movie.type}</Badge>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            <p className="mt-1 text-sm text-[#93939A]">
              {movie.genre}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
         
{/* Watchlist */}
<button
  onClick={() => setIsWatchlisted(!isWatchlisted)}
  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
    isWatchlisted
      ? 'text-[#F4F4F5]'
      : 'text-[#93939A] hover:text-[#F4F4F5]'
  }`}
>
  <i
    className={`${
      isWatchlisted
        ? 'ri-bookmark-fill'
        : 'ri-bookmark-line'
    } text-lg`}
  ></i>

  <span>Watchlist</span>
</button>


{/* Watched */}
<button
  onClick={() => setIsWatched(!isWatched)}
  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
    isWatched
      ? 'text-[#F4F4F5]'
      : 'text-[#93939A] hover:text-[#F4F4F5]'
  }`}
>
  <i
    className={`${
      isWatched
        ? 'ri-checkbox-circle-fill'
        : 'ri-check-line'
    } text-lg`}
  ></i>

  <span>Watched</span>
</button>


{/* Love */}
<button
  onClick={() => setIsLoved(!isLoved)}
  className={`transition-colors ${
    isLoved
      ? 'text-red-400'
      : 'text-[#93939A] hover:text-[#F4F4F5]'
  }`}
  aria-label="Like movie"
>
  <i
    className={`${
      isLoved
        ? 'ri-heart-fill'
        : 'ri-heart-line'
    } text-xl`}
  ></i>
</button>

            <Button onClick={() => setIsReviewOpen(true)}>
              <i className="ri-add-line text-base"></i>
              Review
            </Button>

          </div>

          {/* Movie Metadata */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">

            <span className="text-[#D4D4D8]">
              {movie.year}
            </span>

            <span className="text-[#52525B]">•</span>

            <span className="text-[#D4D4D8]">
              {movie.duration}
            </span>

            <span className="text-[#52525B]">•</span>

            <div className="flex items-center gap-1.5">
              <i className="ri-star-fill text-yellow-400"></i>

              <span className="font-semibold text-[#F4F4F5]">
                {movie.rating}
              </span>
            </div>

            <span className="text-[#52525B]">•</span>

            <span className="text-[#D4D4D8]">
              {movie.country}
            </span>

          </div>

          {/* Director */}
          <p className="mt-3 text-sm text-[#93939A]">
            Director:{' '}
            <span className="text-[#D4D4D8]">
              {movie.director}
            </span>
          </p>

          {/* Synopsis */}
          <div className="mt-4 max-w-2xl">
            <p className="text-sm leading-7 text-[#D4D4D8] sm:text-base">
              {movie.description}
            </p>
          </div>

        </div>
      </section>

      {/* Cast */}
      <section className="container mx-auto px-6 pb-16 pt-14">

        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Cast
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Main Cast
          </h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-3">
          {cast.map((actor) => (
            <div
              key={actor.id}
              className="w-24 flex-shrink-0 text-center"
            >
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-[#12141C]">
                <img
                  src={actor.image}
                  alt={actor.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-[#F4F4F5]">
                {actor.name}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-[#93939A]">
                {actor.role}
              </p>
            </div>
          ))}
        </div>

      </section>
      
      <PopularReviews compact />

      <SimilarMovies />
      
      <ReviewModal 
      isOpen={isReviewOpen}
      onClose={() => setIsReviewOpen(false)}
      />

    </main>
  );
}

export default MovieDetail;