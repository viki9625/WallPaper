import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllWallpapersPage from './pages/AllWallpapersPage';
import SearchModal from './components/SearchModal';
import WallpaperDetailModal from './components/WallpaperDetailModal';
import { mockWallpapers, categories } from './data/mockData';

const App = () => {
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState("home"); // "home" or "all"

  // Filter wallpapers by selected category
  const filteredWallpapers = selectedCategory === "All"
    ? mockWallpapers
    : mockWallpapers.filter(w => w.category === selectedCategory);

  // Get trending wallpapers (first 8 for display)
  const trendingWallpapers = mockWallpapers.slice(0, 8);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage("all");
  };

  const handleViewAllClick = () => {
    setSelectedCategory("All");
    setCurrentPage("all");
  };

  const handleLogoClick = () => {
    setCurrentPage("home");
    setSelectedCategory("All");
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
        
        {/* Header */}
        <Header 
          onSearchClick={() => setSearchOpen(true)}
          onCategoryClick={() => setCurrentPage("all")}
          onLogoClick={handleLogoClick}
        />

        {/* Main Content - Conditional Rendering */}
        <main>
          {currentPage === "home" ? (
            <HomePage
              categories={categories}
              trendingWallpapers={trendingWallpapers}
              onCategoryClick={handleCategoryClick}
              onViewAllClick={handleViewAllClick}
              onWallpaperClick={setSelectedWallpaper}
            />
          ) : (
            <AllWallpapersPage
              wallpapers={filteredWallpapers}
              selectedCategory={selectedCategory}
              categories={categories}
              onCategoryChange={setSelectedCategory}
              onWallpaperClick={setSelectedWallpaper}
            />
          )}
        </main>

        {/* Footer */}
        <Footer />

        {/* Search Modal */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          wallpapers={mockWallpapers}
          onWallpaperClick={setSelectedWallpaper}
        />

        {/* Wallpaper Detail Modal */}
        <WallpaperDetailModal
          wallpaper={selectedWallpaper}
          isOpen={!!selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          allWallpapers={mockWallpapers}
          onWallpaperClick={setSelectedWallpaper}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;