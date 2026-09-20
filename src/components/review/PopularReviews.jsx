import React from 'react';
import ReviewCard from './ReviewCard';

import profile from '../../assets/profile.jpg';
import dummyPoster from '../../assets/Poster1.jpg';

function PopularReviews({ compact = false }) {

  const reviews = [
    {
      id: 1,
      username: "Feby Valentine",
      avatar: profile,
      poster: dummyPoster,
      rating: "9.0",
      date: "13 Sep 2026",
      review: "The visuals are incredible and the story feels even more immersive on a second watch.",
      likes: 24
    },

    {
      id: 2,
      username: "Didan May",
      avatar: profile,
      poster: dummyPoster,
      rating: "8.8",
      date: "10 Sep 2026",
      review: "A beautifully crafted film with great atmosphere, performances, and world building.",
      likes: 18
    },

    {
      id: 3,
      username: "Nadia",
      avatar: profile,
      poster: dummyPoster,
      rating: "9.2",
      date: "8 Sep 2026",
      review: "Every episode keeps getting better. The characters and tension are what make this series special.",
      likes: 31
    }
  ];

  return (
    <section className={`container mx-auto px-6 ${compact ? 'pt-4 pb-16' : 'py-10'}`}>

      {/* SECTION HEADER */}
      <div className="flex items-end justify-between mb-6">

        <div>

          {!compact && (
            <p className="text-xs font-medium uppercase tracking-widest text-[#93939A] mb-2">
              From the community
            </p>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">
            Popular Reviews
          </h2>

        </div>

        {!compact && (
          <button className="hidden sm:block text-sm font-medium text-[#93939A] hover:text-[#F4F4F5] transition-colors">
            See all
          </button>
        )}

      </div>

      {/* REVIEW LIST */}
      <div className="flex flex-col gap-4">

        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            username={review.username}
            avatar={review.avatar}
            poster={review.poster}
            rating={review.rating}
            date={review.date}
            review={review.review}
            likes={review.likes}
            showPoster={!compact}
          />
        ))}

      </div>

    </section>
  );
}

export default PopularReviews;