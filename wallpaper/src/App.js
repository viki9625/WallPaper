import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllWallpapersPage from './pages/AllWallpapersPage';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import WallpaperDetailPage from './pages/WallpaperDetailPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import { useWallpapers, useCategories } from './hooks/useApi';

const AppContent = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { categories, loading: categoriesLoading } = useCategories();
  const { wallpapers: trendingWallpapers, loading: trendingLoading } = useWallpapers('All', 0, 8);
  const { wallpapers, loading: wallpapersLoading } = useWallpapers(selectedCategory, 0, 50);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate('/wallpapers');
  };

  const handleViewAllClick = () => {
    navigate('/wallpapers');
  };

  const handleWallpaperClick = () => {
    // Placeholder handler; actual navigation handled within routed components
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <Header
        onSearchClick={() => navigate('/search')}
        onCategoryClick={() => handleCategoryClick('All')}
        onLogoClick={() => navigate('/')}
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
                loading={trendingLoading}
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
                loading={wallpapersLoading}
              />
            )}
          />
          <Route path="/wallpaper/:id" element={<WallpaperDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;