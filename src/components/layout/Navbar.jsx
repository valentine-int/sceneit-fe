import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import Button from '../common/Button';
import ReviewPicker from '../review/ReviewPicker';
import ReviewModal from '../review/ReviewModal';

import profile from '../../assets/profile.jpg';

import { searchMulti } from '../../services/tmdb';
import { getTmdbImage } from '../../utils/tmdbImages';

function Navbar() {

  // =========================
  // NAVBAR STATE
  // =========================

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // =========================
  // QUICK SEARCH STATE
  // =========================

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // =========================
  // REVIEW STATE
  // =========================

  const [isReviewPickerOpen, setIsReviewPickerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);

  // =========================
  // QUICK SEARCH
  // =========================

  useEffect(() => {

    if (!search.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {

      try {

        setIsSearching(true);
        setIsSearchOpen(true);

        const data = await searchMulti(search);

        const results = (data.results || [])
          .filter(
            (item) =>
              item.media_type === 'movie' ||
              item.media_type === 'tv'
          )
          .slice(0, 6);

        setSearchResults(results);

      } catch (error) {

        console.error(
          'NAVBAR SEARCH ERROR:',
          error
        );

        setSearchResults([]);

      } finally {

        setIsSearching(false);

      }

    }, 400);

    return () => clearTimeout(timer);

  }, [search]);

  // =========================
  // SEARCH RESULT CLICK
  // =========================

  const handleSearchResultClick = () => {

    setSearch('');
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);

  };

  // =========================
  // OPEN REVIEW
  // =========================

  const handleOpenReview = () => {

    setSearch('');
    setSearchResults([]);
    setIsSearchOpen(false);

    setIsMobileMenuOpen(false);

    setIsReviewPickerOpen(true);

  };

  // =========================
  // SELECT REVIEW TITLE
  // =========================

  const handleSelectReviewTitle = (item) => {

    const isSeries = item.media_type === 'tv';

    const selectedMovie = {
      id: item.id,

      title: isSeries
        ? item.name
        : item.title,

      year: isSeries
        ? item.first_air_date?.slice(0, 4)
        : item.release_date?.slice(0, 4),

      type: isSeries
        ? 'Series'
        : 'Movie',

      genre: '',

      poster: item.poster_path
        ? getTmdbImage(
            item.poster_path,
            'w500'
          )
        : null,
    };

    setSelectedTitle(selectedMovie);

    setIsReviewPickerOpen(false);
    setIsReviewModalOpen(true);

  };

  // =========================
  // CLOSE REVIEW MODAL
  // =========================

  const handleCloseReviewModal = () => {

    setIsReviewModalOpen(false);
    setSelectedTitle(null);

  };

  // =========================
  // NAV LINK STYLE
  // =========================

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-[#F4F4F5]'
        : 'text-[#93939A] hover:text-[#F4F4F5]'
    }`;

  return (
    <>
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#27272A]/30 bg-[#090A0F]/95 text-[#F4F4F5] backdrop-blur-md">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="flex items-center gap-8">

            {/* LOGO */}

            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-shrink-0 text-xl font-bold tracking-tight"
            >
              Scene<span className="text-[#F4F4F5]">It</span>
            </Link>

            {/* DESKTOP NAVIGATION */}

            <nav className="hidden items-center gap-6 lg:flex">

              <NavLink
                to="/"
                className={navLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/movies"
                className={navLinkClass}
              >
                Movies
              </NavLink>

              <NavLink
                to="/series"
                className={navLinkClass}
              >
                Series
              </NavLink>

              <NavLink
                to="/explore"
                className={navLinkClass}
              >
                Explore
              </NavLink>

            </nav>

          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="flex items-center gap-3">

            {/* =========================
                SEARCH
            ========================= */}

            <div className="relative hidden sm:block">

              <div className="flex h-10 w-52 items-center rounded-lg border border-[#27272A] bg-[#12141C] px-3 transition-colors focus-within:border-[#3F3F46] md:w-60">

                <i className="ri-search-line mr-2 text-base text-[#93939A]"></i>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onFocus={() => {
                    if (search.trim()) {
                      setIsSearchOpen(true);
                    }
                  }}
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm text-[#F4F4F5] outline-none placeholder:text-[#71717A]"
                />

              </div>

              {/* SEARCH DROPDOWN */}

              {isSearchOpen && (
                <div className="absolute right-0 top-12 z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[#27272A] bg-[#12141C] shadow-2xl">

                  {isSearching && (
                    <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-[#93939A]">

                      <i className="ri-loader-4-line animate-spin text-base"></i>

                      <span>
                        Searching...
                      </span>

                    </div>
                  )}

                  {!isSearching &&
                    searchResults.length > 0 && (
                      <div className="py-2">

                        {searchResults.map((item) => {

                          const isSeries =
                            item.media_type === 'tv';

                          const title = isSeries
                            ? item.name
                            : item.title;

                          const year = isSeries
                            ? item.first_air_date?.slice(0, 4)
                            : item.release_date?.slice(0, 4);

                          return (
                            <Link
                              key={`${item.media_type}-${item.id}`}
                              to={
                                isSeries
                                  ? `/series/${item.id}`
                                  : `/movie/${item.id}`
                              }
                              onClick={
                                handleSearchResultClick
                              }
                              className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#1A1C24]"
                            >

                              {/* POSTER */}

                              <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#090A0F]">

                                {item.poster_path ? (
                                  <img
                                    src={getTmdbImage(
                                      item.poster_path,
                                      'w92'
                                    )}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">

                                    <i className="ri-movie-2-line text-sm text-[#52525B]"></i>

                                  </div>
                                )}

                              </div>

                              {/* INFO */}

                              <div className="min-w-0 flex-1">

                                <p className="truncate text-sm font-medium text-[#F4F4F5]">
                                  {title}
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-xs text-[#93939A]">

                                  <span>
                                    {year || 'N/A'}
                                  </span>

                                  <span>
                                    •
                                  </span>

                                  <span>
                                    {isSeries
                                      ? 'Series'
                                      : 'Movie'}
                                  </span>

                                </div>

                              </div>

                              <i className="ri-arrow-right-s-line text-[#52525B]"></i>

                            </Link>
                          );
                        })}

                      </div>
                    )}

                  {!isSearching &&
                    search.trim() &&
                    searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center">

                        <i className="ri-search-line text-2xl text-[#52525B]"></i>

                        <p className="mt-2 text-sm text-[#93939A]">
                          No movies or series found.
                        </p>

                      </div>
                    )}

                </div>
              )}

            </div>

            {/* =========================
                + REVIEW
            ========================= */}

            <div className="hidden sm:block">

              <Button
                onClick={handleOpenReview}
              >
                <i className="ri-add-line text-base"></i>
                Review
              </Button>

            </div>

            {/* =========================
                PROFILE
            ========================= */}

            <Link
              to="/profile"
              className="hidden h-9 w-9 overflow-hidden rounded-full border border-[#27272A] transition-opacity hover:opacity-80 sm:block"
              aria-label="Open profile"
            >

              <img
                src={profile}
                alt="Profile"
                className="h-full w-full object-cover"
              />

            </Link>

            {/* =========================
                MOBILE MENU BUTTON
            ========================= */}

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(
                  !isMobileMenuOpen
                )
              }
              className="flex h-10 w-10 items-center justify-center text-[#93939A] transition-colors hover:text-[#F4F4F5] sm:hidden"
              aria-label={
                isMobileMenuOpen
                  ? 'Close menu'
                  : 'Open menu'
              }
            >

              <i
                className={`${
                  isMobileMenuOpen
                    ? 'ri-close-line'
                    : 'ri-menu-line'
                } text-xl`}
              ></i>

            </button>

          </div>

        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}

        {isMobileMenuOpen && (
          <div className="border-t border-[#27272A]/50 bg-[#090A0F] sm:hidden">

            <div className="mx-auto max-w-7xl px-4 py-5">

              {/* MOBILE SEARCH */}

              <div className="relative">

                <div className="flex h-11 items-center rounded-lg border border-[#27272A] bg-[#12141C] px-3">

                  <i className="ri-search-line mr-2 text-base text-[#93939A]"></i>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    onFocus={() => {
                      if (search.trim()) {
                        setIsSearchOpen(true);
                      }
                    }}
                    placeholder="Search movies & series..."
                    className="w-full bg-transparent text-sm text-[#F4F4F5] outline-none placeholder:text-[#71717A]"
                  />

                </div>

                {/* MOBILE SEARCH RESULTS */}

                {isSearchOpen && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-[#27272A] bg-[#12141C]">

                    {isSearching && (
                      <div className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-[#93939A]">

                        <i className="ri-loader-4-line animate-spin"></i>

                        <span>
                          Searching...
                        </span>

                      </div>
                    )}

                    {!isSearching &&
                      searchResults.length > 0 && (
                        <div className="max-h-72 overflow-y-auto py-2">

                          {searchResults.map((item) => {

                            const isSeries =
                              item.media_type === 'tv';

                            const title = isSeries
                              ? item.name
                              : item.title;

                            const year = isSeries
                              ? item.first_air_date?.slice(0, 4)
                              : item.release_date?.slice(0, 4);

                            return (
                              <Link
                                key={`${item.media_type}-${item.id}`}
                                to={
                                  isSeries
                                    ? `/series/${item.id}`
                                    : `/movie/${item.id}`
                                }
                                onClick={
                                  handleSearchResultClick
                                }
                                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#1A1C24]"
                              >

                                <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#090A0F]">

                                  {item.poster_path ? (
                                    <img
                                      src={getTmdbImage(
                                        item.poster_path,
                                        'w92'
                                      )}
                                      alt={title}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">

                                      <i className="ri-movie-2-line text-sm text-[#52525B]"></i>

                                    </div>
                                  )}

                                </div>

                                <div className="min-w-0 flex-1">

                                  <p className="truncate text-sm font-medium text-[#F4F4F5]">
                                    {title}
                                  </p>

                                  <div className="mt-1 flex items-center gap-2 text-xs text-[#93939A]">

                                    <span>
                                      {year || 'N/A'}
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      {isSeries
                                        ? 'Series'
                                        : 'Movie'}
                                    </span>

                                  </div>

                                </div>

                                <i className="ri-arrow-right-s-line text-[#52525B]"></i>

                              </Link>
                            );
                          })}

                        </div>
                      )}

                    {!isSearching &&
                      search.trim() &&
                      searchResults.length === 0 && (
                        <div className="px-4 py-6 text-center">

                          <p className="text-sm text-[#93939A]">
                            No movies or series found.
                          </p>

                        </div>
                      )}

                  </div>
                )}

              </div>

              {/* MOBILE NAVIGATION */}

              <nav className="mt-5 flex flex-col">

                <NavLink
                  to="/"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    `border-b border-[#27272A]/50 py-3 text-sm font-medium ${
                      isActive
                        ? 'text-[#F4F4F5]'
                        : 'text-[#93939A]'
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/movies"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    `border-b border-[#27272A]/50 py-3 text-sm font-medium ${
                      isActive
                        ? 'text-[#F4F4F5]'
                        : 'text-[#93939A]'
                    }`
                  }
                >
                  Movies
                </NavLink>

                <NavLink
                  to="/series"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    `border-b border-[#27272A]/50 py-3 text-sm font-medium ${
                      isActive
                        ? 'text-[#F4F4F5]'
                        : 'text-[#93939A]'
                    }`
                  }
                >
                  Series
                </NavLink>

                <NavLink
                  to="/explore"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    `border-b border-[#27272A]/50 py-3 text-sm font-medium ${
                      isActive
                        ? 'text-[#F4F4F5]'
                        : 'text-[#93939A]'
                    }`
                  }
                >
                  Explore
                </NavLink>

              </nav>

              {/* MOBILE ACTIONS */}

              <div className="mt-5 flex items-center justify-between gap-3">

                <Button
                  onClick={handleOpenReview}
                  className="flex-1"
                >
                  <i className="ri-add-line text-base"></i>
                  Review
                </Button>

                <Link
                  to="/profile"
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="flex h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[#27272A]"
                  aria-label="Open profile"
                >

                  <img
                    src={profile}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />

                </Link>

              </div>

            </div>

          </div>
        )}

      </header>

      {/* =========================
          REVIEW PICKER
      ========================= */}

      <ReviewPicker
        isOpen={isReviewPickerOpen}
        onClose={() =>
          setIsReviewPickerOpen(false)
        }
        onSelect={handleSelectReviewTitle}
      />

      {/* =========================
          REVIEW MODAL
      ========================= */}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        movie={selectedTitle}
        onPublish={() => {
          handleCloseReviewModal();
        }}
      />

    </>
  );
}

export default Navbar;