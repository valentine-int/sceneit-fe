import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../../services/authService';

function Register() {

  // =========================
  // FORM STATE
  // =========================

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // =========================
  // UI STATE
  // =========================

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


  // =========================
  // HANDLE REGISTER
  // =========================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setErrorMessage('');

    // NAME VALIDATION

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }

    // EMAIL VALIDATION

    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    // PASSWORD VALIDATION

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    // CONFIRM PASSWORD

    if (!confirmPassword) {
      setErrorMessage('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {

      setIsLoading(true);

      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Register berhasil
      navigate('/');

    } catch (error) {

      console.error('REGISTER ERROR:', error);

      setErrorMessage(
        error.message || 'Registration failed. Please try again.'
      );

    } finally {

      setIsLoading(false);

    }
  };


  return (

    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">

      <div className="mx-auto w-full max-w-md">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">

          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Join SceneIt
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#93939A]">
            Create an account to keep track of what you watch.
          </p>

        </div>


        {/* =========================
            REGISTER FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>

            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#D4D4D8]"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrorMessage('');
              }}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-lg border border-[#27272A] bg-[#12141C] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#F4F4F5]"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#D4D4D8]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage('');
              }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-[#27272A] bg-[#12141C] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#F4F4F5]"
            />

          </div>


          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#D4D4D8]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage('');
              }}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full rounded-lg border border-[#27272A] bg-[#12141C] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#F4F4F5]"
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-[#D4D4D8]"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setErrorMessage('');
              }}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-[#27272A] bg-[#12141C] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#F4F4F5]"
            />

          </div>


          {/* ERROR */}

          {errorMessage && (

            <div className="flex items-start gap-2 text-sm text-red-400">

              <i className="ri-error-warning-line mt-0.5 text-base"></i>

              <p>
                {errorMessage}
              </p>

            </div>

          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#F4F4F5] px-4 py-3 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7] disabled:cursor-not-allowed disabled:opacity-50"
          >

            {isLoading
              ? 'Creating account...'
              : 'Create account'
            }

          </button>

        </form>


        {/* =========================
            LOGIN LINK
        ========================= */}

        <p className="mt-8 text-center text-sm text-[#93939A]">

          Already have an account?{' '}

          <Link
            to="/login"
            className="font-medium text-[#F4F4F5] transition-colors hover:text-[#D4D4D8]"
          >
            Log in
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Register;