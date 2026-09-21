import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
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

function App() {
  return (
    <BrowserRouter basename="/sceneit-fe">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/profile" element={<PublicProfile />} />
        <Route path="/me/reviews" element={<MyReviews />} />
        <Route path="/me/watchlist" element={<MyWatchlist />} />
        <Route path="/me/watched" element={<MyWatched />} />
        <Route path="/me/favorite" element={<MyFavorite />} />
        
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;