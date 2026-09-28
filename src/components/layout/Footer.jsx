import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#090A0F]">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-[#F4F4F5] transition-colors hover:text-white"
            >
              SceneIt
            </Link>

            <p className="mt-1 text-xs text-[#93939A]">
              Discover. Review. Share.
            </p>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-wrap items-center gap-5 text-sm text-[#93939A]">
            <Link
              to="/"
              className="transition-colors hover:text-[#F4F4F5]"
            >
              Home
            </Link>

            <Link
              to="/movies"
              className="transition-colors hover:text-[#F4F4F5]"
            >
              Movies
            </Link>

            <Link
              to="/series"
              className="transition-colors hover:text-[#F4F4F5]"
            >
              Series
            </Link>

            <Link
              to="/explore"
              className="transition-colors hover:text-[#F4F4F5]"
            >
              Explore
            </Link>
          </nav>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-6 border-t border-[#27272A] pt-5">
          <p className="text-xs text-[#93939A]">
            © 2026 SceneIt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;