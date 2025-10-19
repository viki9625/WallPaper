import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllWallpapersPage from './pages/AllWallpapersPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { categories } from './data/mockData';
import WallpaperDetailPage from './pages/WallpaperDetailPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  // Routing replaces in-component navigation state

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage categories={categories} />} />
              <Route path="/wallpapers" element={<AllWallpapersPage categories={categories} />} />
              <Route path="/wallpaper/:id" element={<WallpaperDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;