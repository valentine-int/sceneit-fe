import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Explore from './pages/Explore';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar global, muncul di semua halaman */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/movie/:id" element={<MovieDetail />} />

      </Routes>

      {/* Footer global, muncul di semua halaman */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
