import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllWallpapersPage from './pages/AllWallpapersPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { categories, api } from './data/mockData';
import WallpaperDetailPage from './pages/WallpaperDetailPage';
import SearchPage from './pages/SearchPage';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trendingWallpapers, setTrendingWallpapers] = useState([]);
  const [wallpapers, setWallpapers] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getTrending().then(items => {
      if (isMounted) setTrendingWallpapers(items);
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    api.getAll({ category: selectedCategory }).then(result => {
      if (isMounted) setWallpapers(result.items);
    });
    return () => { isMounted = false; };
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleViewAllClick = () => {
    // Intentionally left blank for now; routing handled via navigation/UI
  };

  const handleWallpaperClick = () => {
    // Placeholder handler; actual navigation handled within routed components
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
          <Header
            onSearchClick={() => {}}
            onCategoryClick={() => handleCategoryClick('All')}
            onLogoClick={() => {}}
          />
          <main>
            <Routes>
              <Route
                path="/"
                element={(
                  <HomePage
                    categories={categories}
                    trendingWallpapers={trendingWallpapers}
                    onCategoryClick={handleCategoryClick}
                    onViewAllClick={handleViewAllClick}
                    onWallpaperClick={handleWallpaperClick}
                  />
                )}
              />
              <Route
                path="/wallpapers"
                element={(
                  <AllWallpapersPage
                    categories={categories}
                    wallpapers={wallpapers}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    onWallpaperClick={handleWallpaperClick}
                  />
                )}
              />
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