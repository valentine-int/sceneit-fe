import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import profile from '../../assets/profile.jpg';
import Button from '../common/Button';

function Navbar() {
  const [show, setShow] = useState(false);

  return (
    <div className="navbar fixed top-0 left-0 w-full transition-all py-4 bg-[#090A0F]/95 backdrop-blur-md text-[#F4F4F5] z-50 border-b border-[#27272A]/30">

      <div className="container mx-auto px-6">

        <div className="navbar-box flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-10">

            {/* LOGO */}
            <Link to="/" className="logo">
              <h1 className="text-xl font-bold tracking-tight text-[#F4F4F5]">
                SceneIt
              </h1>
            </Link>

            {/* DESKTOP MENU */}
            <ul className="hidden md:flex items-center gap-8 text-sm font-medium">

              <li>
                <Link
                  to="/"
                  className="opacity-60 hover:opacity-90 transition-all"
                >
                  Home
                </Link>
              </li>

              <li>
                <a
                  href="#"
                  className="opacity-60 hover:opacity-90 transition-all"
                >
                  Movies
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="opacity-60 hover:opacity-90 transition-all"
                >
                  Series
                </a>
              </li>

              <li>
                <Link
                  to="/explore"
                  className="opacity-60 hover:opacity-90 transition-all"
                >
                  Explore
                </Link>
              </li>

            </ul>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5 sm:gap-6">

            {/* SEARCH */}
            <a
              href="#"
              className="opacity-60 hover:opacity-90 transition-all py-1"
            >
              <i className="ri-search-line text-lg sm:text-xl"></i>
            </a>

            {/* PROFILE */}
            <a
              href="#"
              className="hidden md:block w-8 h-8 rounded-full bg-[#12141C] border border-[#27272A] overflow-hidden transition-all hover:scale-105"
            >
              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </a>

            {/* REVIEW BUTTON */}
            <Button>
              + Review
            </Button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setShow(!show)}
              className="block md:hidden focus:outline-none opacity-60 hover:opacity-90 transition-colors"
            >
              <i className="ri-menu-3-line text-xl sm:text-2xl"></i>
            </button>

          </div>

        </div>

      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          show
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShow(false)}
      />

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-[#090A0F] border-r border-[#27272A]/40 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:hidden ${
          show ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        <div>

          {/* SIDEBAR HEADER */}
          <div className="flex items-center justify-between pb-6 border-b border-[#27272A]/40">

            <Link
              to="/"
              onClick={() => setShow(false)}
              className="text-xl font-bold text-[#F4F4F5]"
            >
              SceneIt
            </Link>

            <button
              onClick={() => setShow(false)}
              className="text-[#93939A] hover:text-[#F4F4F5]"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

          </div>

          {/* MOBILE PROFILE */}
          <div className="flex items-center gap-4 mt-6 p-3 rounded-xl bg-[#12141C] border border-[#27272A]/20">

            <div className="w-10 h-10 rounded-full bg-[#090A0F] border border-[#27272A] overflow-hidden flex-shrink-0">

              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover"
              />

            </div>

            <div>

              <p className="font-semibold text-[#F4F4F5] text-sm leading-tight">
                Feby Valentine
              </p>

              <p className="text-xs text-[#93939A]">
                @febyvalentine
              </p>

            </div>

          </div>

          {/* MOBILE MENU */}
          <ul className="flex flex-col gap-5 mt-6 font-medium text-base">

            <li>
              <Link
                to="/"
                onClick={() => setShow(false)}
                className="opacity-60 hover:opacity-90 text-[#F4F4F5] block py-1"
              >
                Home
              </Link>
            </li>

            <li>
              <a
                href="#"
                onClick={() => setShow(false)}
                className="opacity-60 hover:opacity-90 text-[#F4F4F5] block py-1"
              >
                Movies
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={() => setShow(false)}
                className="opacity-60 hover:opacity-90 text-[#F4F4F5] block py-1"
              >
                Series
              </a>
            </li>

            <li>
              <Link
                to="/explore"
                onClick={() => setShow(false)}
                className="opacity-60 hover:opacity-90 text-[#F4F4F5] block py-1"
              >
                Explore
              </Link>
            </li>

          </ul>

        </div>

      </div>

    </div>
  );
}

export default Navbar;