import React from 'react';
import { X, Download } from 'lucide-react';
import WallpaperCard from './WallpaperCard';

const WallpaperDetailModal = ({ 
  wallpaper, 
  isOpen, 
  onClose, 
  allWallpapers, 
  onWallpaperClick 
}) => {
  if (!isOpen || !wallpaper) return null;

  // Find related wallpapers based on category or tags
  const relatedWallpapers = allWallpapers
    .filter(w => 
      w.id !== wallpaper.id && 
      (w.category === wallpaper.category || 
       w.tags.some(tag => wallpaper.tags.includes(tag)))
    )
    .slice(0, 4);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {wallpaper.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Wallpaper Preview Image */}
          <div className="relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg">
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              className="w-full h-auto"
            />
          </div>

          {/* Details and Download Section */}
          <div className="space-y-4">
            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {wallpaper.category}
              </span>
              {wallpaper.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Download Button */}
            <a
                href={wallpaper.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Download size={20} />
                <span>Download Wallpaper</span>
              </a>
          </div>

          {/* Related Wallpapers Section */}
          {relatedWallpapers.length > 0 && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span>Related Wallpapers</span>
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({relatedWallpapers.length})
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedWallpapers.map(w => (
                  <WallpaperCard
                    key={w.id}
                    wallpaper={w}
                    onClick={() => onWallpaperClick(w)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallpaperDetailModal;