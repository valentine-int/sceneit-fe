import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import UserCard from '../components/common/UserCard';
import { searchUsers } from '../services/socialService';

function UserSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const data = await searchUsers(search.trim());
        setResults(data.users || []);
      } catch (err) {
        console.error('USER SEARCH ERROR:', err);
        setError(err.message || 'Failed to search users.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleFollowChange = (userId, isFollowing) => {
    setResults((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, isFollowing } : user
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#090A0F] px-6 py-32 text-[#F4F4F5]">
      <section className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#93939A]">
            Connect
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">People</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#93939A]">
            Search for other users and follow them to see their activity in your feed.
          </p>
        </div>

        <div className="flex h-12 items-center rounded-xl border border-[#27272A] bg-[#12141C] px-4">
          <i className="ri-search-line mr-3 text-lg text-[#93939A]"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-transparent text-sm text-[#F4F4F5] outline-none placeholder:text-[#71717A]"
          />
        </div>

        <div className="mt-6">
          {loading && (
            <div className="py-10 text-center">
              <i className="ri-loader-4-line animate-spin text-2xl text-[#93939A]"></i>
              <p className="mt-3 text-sm text-[#93939A]">Searching...</p>
            </div>
          )}

          {!loading && error && (
            <p className="py-10 text-center text-sm text-red-400">{error}</p>
          )}

          {!loading && !error && search.trim() && results.length === 0 && (
            <div className="py-10 text-center">
              <i className="ri-user-search-line text-2xl text-[#52525B]"></i>
              <p className="mt-3 text-sm text-[#93939A]">No users found.</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="flex flex-col gap-3">
              {results.map((user) => (
                <UserCard key={user.id} user={user} onFollowChange={handleFollowChange} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default UserSearch;