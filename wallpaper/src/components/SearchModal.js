import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import WallpaperCard from './WallpaperCard';

const SearchModal = ({ isOpen, onClose, wallpapers, onWallpaperClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWallpapers = wallpapers.filter(w =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-4">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search wallpapers by name, tag, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            autoFocus
          />
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {searchQuery === '' ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Start typing to search wallpapers...</p>
            </div>
          ) : filteredWallpapers.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <p className="text-lg">
                No wallpapers found matching "<strong>{searchQuery}</strong>"
              </p>
              <p className="text-sm mt-2">Try different keywords</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Found {filteredWallpapers.length} wallpaper{filteredWallpapers.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredWallpapers.map(wallpaper => (
                  <div
                    key={wallpaper.id}
                    onClick={() => {
                      onWallpaperClick(wallpaper);
                      onClose();
                    }}
                  >
                    <WallpaperCard wallpaper={wallpaper} onClick={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;