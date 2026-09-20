import React from 'react';
import 'remixicon/fonts/remixicon.css';
import Badge from '../common/Badge';

function MovieCard({ title, year, rating, poster, type }) {
  return (
    <div className="group">

      {/* POSTER */}
      <div className="relative aspect-[2/3] bg-[#090A0F] overflow-hidden rounded-xl">

        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

        {/* TYPE */}
        <div className="absolute top-3 left-3">
          <Badge>{type}</Badge>
        </div>

        {/* RATING */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-[#090A0F]/80 px-2 py-1 backdrop-blur-sm">
          <i className="ri-star-fill text-xs text-yellow-400"></i>

          <span className="text-xs font-semibold text-[#F4F4F5]">
            {rating}
          </span>
        </div>

      </div>

      {/* TITLE */}
      <div className="pt-3">
        <h3 className="text-sm font-semibold text-[#F4F4F5] leading-snug">
          {title}{' '}
          <span className="font-normal text-[#93939A]">
            ({year})
          </span>
        </h3>
      </div>

    </div>
  );
}

export default MovieCard;