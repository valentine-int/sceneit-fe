import React from 'react';

function Footer() {
  return (
    <footer className="border-t border-[#27272A] bg-[#090A0F]">

      <div className="container mx-auto px-6 py-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* BRAND */}
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#F4F4F5]">
              SceneIt
            </h2>

            <p className="mt-1 text-xs text-[#93939A]">
              Discover. Review. Share.
            </p>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-wrap items-center gap-5 text-sm text-[#93939A]">

            <a
              href="#"
              className="hover:text-[#F4F4F5] transition-colors"
            >
              Home
            </a>

            <a
              href="#"
              className="hover:text-[#F4F4F5] transition-colors"
            >
              Movies
            </a>

            <a
              href="#"
              className="hover:text-[#F4F4F5] transition-colors"
            >
              Series
            </a>

            <a
              href="#"
              className="hover:text-[#F4F4F5] transition-colors"
            >
              Explore
            </a>

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