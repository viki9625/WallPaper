import React from 'react';
import WallpaperCard from '../components/WallpaperCard';

const AllWallpapersPage = ({ 
  wallpapers, 
  selectedCategory,
  categories,
  onCategoryChange,
  onWallpaperClick 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Filter */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          All Wallpapers
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Wallpapers Grid */}
      <section>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedCategory === "All" ? "All Wallpapers" : selectedCategory}
            <span className="ml-3 text-lg font-normal text-gray-500">
              ({wallpapers.length})
            </span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wallpapers.map(wallpaper => (
            <WallpaperCard
              key={wallpaper.id}
              wallpaper={wallpaper}
              onClick={() => onWallpaperClick(wallpaper)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AllWallpapersPage;