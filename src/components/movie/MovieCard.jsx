import React from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import Badge from '../common/Badge';

function MovieCard({ id, title, year, rating, poster, type }) {

  const detailPath =
    type === 'Series'
      ? `/series/${id}`
      : `/movie/${id}`;

  return (
    <Link
      to={detailPath}
      className="group block"
    >
      
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#090A0F]">

        <img
          src={poster}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

        <div className="absolute left-3 top-3">
          <Badge>{type}</Badge>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-[#090A0F]/80 px-2 py-1 backdrop-blur-sm">
          <i className="ri-star-fill text-xs text-yellow-400"></i>

          <span className="text-xs font-semibold text-[#F4F4F5]">
            {rating}
          </span>
        </div>

      </div>

      <div className="pt-3">
        <h3 className="text-sm font-semibold leading-snug text-[#F4F4F5]">
          {title}{' '}

          <span className="font-normal text-[#93939A]">
            ({year})
          </span>
        </h3>
      </div>
    </Link>
  );
}

export default MovieCard;