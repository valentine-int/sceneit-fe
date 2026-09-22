import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { loginUser } from '../../services/authService';

function Login() {
  const { setUser } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Handle login
  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);

      const result = await loginUser({
        email: email.trim(),
        password,
      });

      // Simpan user ke AuthContext
      setUser(result.user);

      // Login berhasil
      navigate('/');
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      setErrorMessage(
        error.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">

      <div className="mx-auto w-full max-w-md">

        {/* Header */}

        <div className="mb-8">

          <p className="text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Log in to SceneIt
          </h1>

        </div>

        {/* Login form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

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

          {/* Password */}

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
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#27272A] bg-[#12141C] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition-colors placeholder:text-[#52525B] focus:border-[#F4F4F5]"
            />

          </div>

          {/* Error */}

          {errorMessage && (
            <div className="flex items-start gap-2 text-sm text-red-400">

              <i className="ri-error-warning-line mt-0.5 text-base"></i>

              <p>
                {errorMessage}
              </p>

            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#F4F4F5] px-4 py-3 text-sm font-semibold text-[#090A0F] transition-colors hover:bg-[#E4E4E7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>

        </form>

        {/* Register */}

        <p className="mt-8 text-center text-sm text-[#93939A]">

          Don't have an account?{' '}

          <Link
            to="/register"
            className="font-medium text-[#F4F4F5] transition-colors hover:text-[#D4D4D8]"
          >
            Create an account
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;