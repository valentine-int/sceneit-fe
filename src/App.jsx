import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Explore from './pages/Explore';
import MovieDetail from './pages/MovieDetail';
import Movies from './pages/Movies';
import Series from './pages/Series';
import SeriesDetail from './pages/SeriesDetail';
import PublicProfile from './pages/profile/PublicProfile';
import MyReviews from './pages/profile/MyReviews';
import MyWatchlist from './pages/profile/MyWatchlist';
import MyWatched from './pages/profile/MyWatched';
import MyFavorite from './pages/profile/MyFavorite';
import UserSearch from './pages/UserSearch';
import AdminRoute from './components/common/AdminRoute';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminFeatured from './pages/admin/AdminFeatured';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/people" element={<UserSearch />} />
          
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/profile" element={<PublicProfile />} />

          <Route path="/me/reviews" element={<MyReviews />} />
          <Route path="/me/watchlist" element={<MyWatchlist />} />
          <Route path="/me/watched" element={<MyWatched />} />
          <Route path="/me/favorite" element={<MyFavorite />} />

          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/featured" element={<AdminRoute><AdminFeatured /></AdminRoute>} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>

        <Footer />

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;