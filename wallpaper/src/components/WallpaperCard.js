import React, { useState } from 'react';
import { Heart, Download, Eye } from 'lucide-react';
import { useWallpaperActions } from '../hooks/useApi';
// Simple toast-like helper
const showDownloadNotification = (success, message = '') => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
    success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  notification.textContent = message || (success ? 'Download started!' : 'Download failed.');
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => document.body.contains(notification) && document.body.removeChild(notification), 300);
  }, 3000);
};

const WallpaperCard = ({ wallpaper, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { likeWallpaper, downloadWallpaper, loading } = useWallpaperActions();

  const handleLike = async (e) => {
    e.stopPropagation();
    const result = await likeWallpaper(wallpaper.id);
    if (result.success) {
      setIsLiked(!isLiked);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    
    if (isDownloading) return; // Prevent multiple clicks
    
    setIsDownloading(true);
    try {
      // First increment the download count on the backend
      const result = await downloadWallpaper(wallpaper.id);
      if (result.success) {
        // Open the precomputed direct download URL
        if (wallpaper.downloadUrl) {
          window.open(wallpaper.downloadUrl, '_blank');
          showDownloadNotification(true, `${wallpaper.title} download started!`);
        } else {
          showDownloadNotification(false, 'No download URL available.');
        }
      } else {
        showDownloadNotification(false, result.error || 'Download failed. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      showDownloadNotification(false, error.message || 'Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="aspect-video bg-gray-200 dark:bg-gray-800">
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback to original file URL or a neutral placeholder if thumbnail fails
            if (wallpaper.fallbackTried) return;
            wallpaper.fallbackTried = true;
            e.currentTarget.src = wallpaper.downloadUrl || wallpaper.imageUrl || 'https://via.placeholder.com/800x450?text=Wallpaper';
          }}
        />
      </div>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg mb-2">
            {wallpaper.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {wallpaper.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <span className="text-white text-sm">{wallpaper.likesCount || 0}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">{wallpaper.downloadCount || 0}</span>
              <button
                onClick={handleDownload}
                disabled={loading || isDownloading}
                className={`p-2 rounded-full transition-colors ${
                  isDownloading 
                    ? 'bg-blue-500 text-white cursor-not-allowed' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Download size={16} className={isDownloading ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;