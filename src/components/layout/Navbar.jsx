import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { logoutUser } from '../../services/authService';
import 'remixicon/fonts/remixicon.css';
import { createMovieReview, likeReview } from '../../services/reviewService';
import { getMovieDetail, searchMultiContent } from '../../services/movieService';

import Button from '../common/Button';
import ReviewPicker from '../review/ReviewPicker';
import ReviewModal from '../review/ReviewModal';
import NotificationBell from './NotificationBell';
import profile from '../../assets/profile.jpg';

import { getTmdbImage } from '../../utils/tmdbImages';

function Navbar() {
  const { user, setUser, isLoading } = useAuth();
  const { showToast } = useToast();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('LOGOUT ERROR:', error);
    }
  };

  // Quick search state
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const profileRef = useRef(null);

  // Review state
  const [isReviewPickerOpen, setIsReviewPickerOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [reviewPublishError, setReviewPublishError] = useState('');

  // Quick search
  const runSearch = async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setIsSearchOpen(false);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setIsSearchOpen(true);

      const data = await searchMultiContent(trimmedQuery);
      const results = (data.results || []).slice(0, 6);

      setSearchResults(results);
    } catch (error) {
      console.error('NAVBAR SEARCH ERROR:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!search.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      setIsSearching(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      runSearch(search);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  useEffect(() => {
  const handleProfileClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setIsProfileMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleProfileClickOutside);

  return () => {
    document.removeEventListener(
      'mousedown',
      handleProfileClickOutside
    );
  };
}, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedDesktopSearch =
        searchContainerRef.current?.contains(event.target);

      const clickedMobileSearch =
        mobileSearchContainerRef.current?.contains(event.target);

      if (!clickedDesktopSearch && !clickedMobileSearch) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      runSearch(search);
    }

    if (event.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  // Search result click
  const handleSearchResultClick = () => {
    setSearch('');
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Open review
  const handleOpenReview = () => {
    setSearch('');
    setSearchResults([]);
    setIsSearchOpen(false);

    setIsMobileMenuOpen(false);

    setIsReviewPickerOpen(true);
  };

  // Select review title
  const handleSelectReviewTitle = async (item) => {
    const isSeries = item.type === 'series';

    const baseMovie = {
      id: item.tmdbId,
      title: item.title,
      year: item.releaseYear,
      type: isSeries ? 'Series' : 'Movie',
      genre: '',
      poster: item.posterPath
        ? getTmdbImage(item.posterPath, 'w500')
        : null,
    };

    setSelectedTitle(baseMovie);
    setIsReviewPickerOpen(false);
    setIsReviewModalOpen(true);

    try {
      const detail = await getMovieDetail(
        item.tmdbId,
        isSeries ? 'series' : 'movie'
      );

      setSelectedTitle((current) =>
        current ? { ...current, id: detail.id } : current
      );
    } catch (error) {
      console.error('NAVBAR CACHE MOVIE ERROR:', error);

      setReviewPublishError(
        'Failed to prepare this title for review.'
      );
    }
  };

  // Close review modal
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedTitle(null);
  };

  // Handle Navbar Review Publish
  const handleNavbarReviewPublish = async (reviewData) => {
    if (!user) {
      throw new Error('Please log in to write a review.');
    }

    if (!selectedTitle?.id) {
      throw new Error('Movie information is not ready yet.');
    }

    try {
      setReviewPublishError('');

      const result = await createMovieReview(selectedTitle.id, {
        rating: reviewData.rating,
        content: reviewData.reviewText,
        containsSpoiler: reviewData.containsSpoiler,
      });

      const createdReview = result.review;

      if (reviewData.liked && createdReview?.id) {
        await likeReview(createdReview.id);
      }

      showToast('Your review was published!', 'success');

      handleCloseReviewModal();
    } catch (error) {
      console.error('NAVBAR REVIEW ERROR:', error);

      setReviewPublishError(
        error.message || 'Failed to publish your review.'
      );

      throw error;
    }
  };

  // Nav link style
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-[#F4F4F5]'
        : 'text-[#93939A] hover:text-[#F4F4F5]'
    }`;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#27272A]/30 bg-[#090A0F]/95 text-[#F4F4F5] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          <div className="flex items-center gap-8">

            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-shrink-0 text-xl font-bold tracking-tight"
            >
              Scene<span className="text-[#F4F4F5]">It</span>
            </Link>

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

          <div className="flex items-center gap-3">

            <div
              ref={searchContainerRef}
              className="relative hidden sm:block"
            >

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
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search..."
                  className="w-full bg-transparent text-sm text-[#F4F4F5] outline-none placeholder:text-[#71717A]"
                />

                {isSearching && (
                  <i className="ri-loader-4-line ml-2 animate-spin text-sm text-[#71717A]"></i>
                )}

                {!isSearching && search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setSearchResults([]);
                      setIsSearchOpen(false);
                    }}
                    aria-label="Clear search"
                    className="ml-2 text-[#71717A] transition-colors hover:text-[#F4F4F5]"
                  >
                    <i className="ri-close-line text-base"></i>
                  </button>
                )}

              </div>

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
                          const isSeries = item.type === 'series';
                          const title = item.title;
                          const year = item.releaseYear;

                          return (
                            <Link
                              key={`${item.type}-${item.tmdbId}`}
                              to={
                                isSeries
                                  ? `/series/${item.tmdbId}`
                                  : `/movie/${item.tmdbId}`
                              }
                              onClick={handleSearchResultClick}
                              className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#1A1C24]"
                            >

                              <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#090A0F]">

                                {item.posterPath ? (
                                  <img
                                    src={getTmdbImage(
                                      item.posterPath,
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

                                  <span>•</span>

                                  <span>
                                    {isSeries ? 'Series' : 'Movie'}
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

            <NotificationBell />

            <div className="hidden sm:block">

              <Button onClick={handleOpenReview}>
                <i className="ri-add-line text-base"></i>
                Review
              </Button>

            </div>

            {!isLoading && user ? (
              <div 
              ref={profileRef}
              className="relative hidden sm:block">

                <button
                  type="button"
                  onClick={() =>
                    setIsProfileMenuOpen(!isProfileMenuOpen)
                  }
                  className="h-9 w-9 overflow-hidden rounded-full border border-[#27272A] transition-opacity hover:opacity-80"
                  aria-label="Open profile menu"
                  aria-expanded={isProfileMenuOpen}
                >
                  <img
                    src={user.avatarUrl || profile}
                    alt={user.name || 'Profile'}
                    className="h-full w-full object-cover"
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-xl border border-[#27272A] bg-[#12141C] shadow-2xl">

                    <div className="border-b border-[#27272A] px-4 py-3">

                      <p className="truncate text-sm font-semibold text-[#F4F4F5]">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-[#93939A]">
                        {user.email}
                      </p>

                    </div>

                    <div className="py-1">

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-user-line"></i>
                        Profile
                      </Link>

                      <Link
                        to="/people"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-team-line"></i>
                        People
                      </Link>

                      <Link
                        to="/me/reviews"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-chat-3-line"></i>
                        My Reviews
                      </Link>

                      <Link
                        to="/me/watchlist"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-bookmark-line"></i>
                        Watchlist
                      </Link>

                      <Link
                        to="/me/watched"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-checkbox-circle-line"></i>
                        Watched
                      </Link>

                      <Link
                        to="/me/favorite"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-heart-line"></i>
                        Favorite
                      </Link>

                      {user.role === 'admin' && (
                      
                      <Link
                        to="/admin/reports"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-shield-star-line"></i>
                        Admin Panel
                      </Link>
                    )}

                    </div>

                    <div className="border-t border-[#27272A] py-1">

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] hover:text-[#F4F4F5]"
                      >
                        <i className="ri-logout-box-r-line"></i>
                        Log out
                      </button>

                    </div>

                  </div>
                )}

              </div>
            ) : !isLoading ? (
              <Link
                to="/login"
                className="hidden sm:block"
              >
                <Button variant="ghost">
                  Log in
                </Button>
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
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

        {isMobileMenuOpen && (
          <div className="border-t border-[#27272A]/50 bg-[#090A0F] sm:hidden">

            <div className="mx-auto max-w-7xl px-4 py-5">

              <div
                ref={mobileSearchContainerRef}
                className="relative"
              >

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
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search movies & series..."
                    className="w-full bg-transparent text-sm text-[#F4F4F5] outline-none placeholder:text-[#71717A]"
                  />

                  {isSearching && (
                    <i className="ri-loader-4-line ml-2 animate-spin text-sm text-[#71717A]"></i>
                  )}

                  {!isSearching && search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setSearchResults([]);
                        setIsSearchOpen(false);
                      }}
                      aria-label="Clear search"
                      className="ml-2 text-[#71717A] transition-colors hover:text-[#F4F4F5]"
                    >
                      <i className="ri-close-line text-base"></i>
                    </button>
                  )}

                </div>

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
                            const isSeries = item.type === 'series';
                            const title = item.title;
                            const year = item.releaseYear;

                            return (
                              <Link
                                key={`${item.type}-${item.tmdbId}`}
                                to={
                                  isSeries
                                    ? `/series/${item.tmdbId}`
                                    : `/movie/${item.tmdbId}`
                                }
                                onClick={handleSearchResultClick}
                                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#1A1C24]"
                              >

                                <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#090A0F]">

                                  {item.posterPath ? (
                                    <img
                                      src={getTmdbImage(
                                        item.posterPath,
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

                                    <span>•</span>

                                    <span>
                                      {isSeries ? 'Series' : 'Movie'}
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

              <div className="mt-5 flex items-center justify-between gap-3">

                {!isLoading && user ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[#27272A]"
                    aria-label="Open profile"
                  >
                    <img
                      src={user.avatarUrl || profile}
                      alt={user.name || 'Profile'}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                ) : !isLoading ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost">
                      Log in
                    </Button>
                  </Link>
                ) : null}

                <Button
                  onClick={handleOpenReview}
                  className="flex-1"
                >
                  <i className="ri-add-line text-base"></i>
                  Review
                </Button>

                {!isLoading && user && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm font-medium text-[#93939A] transition-colors hover:text-[#F4F4F5]"
                  >
                    Log out
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

      </header>

      <ReviewPicker
        isOpen={isReviewPickerOpen}
        onClose={() =>
          setIsReviewPickerOpen(false)
        }
        onSelect={handleSelectReviewTitle}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        movie={selectedTitle}
        onPublish={handleNavbarReviewPublish}
      />
    </>
  );
}

export default Navbar;