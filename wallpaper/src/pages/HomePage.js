import React from 'react';
import { Download, TrendingUp, Sparkles } from 'lucide-react';
import WallpaperCard from '../components/WallpaperCard';

const HomePage = ({ 
  categories, 
  trendingWallpapers, 
  onCategoryClick, 
  onViewAllClick,
  onWallpaperClick 
}) => {
  return (
    <div>
      {/* Hero Section - Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <Sparkles className="text-yellow-500" size={20} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  100% Free HD Wallpapers
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Transform
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Your Screen
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                Discover thousands of stunning HD wallpapers. Perfect for desktop, mobile, and tablet. Download instantly, completely free.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={onViewAllClick}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Browse Wallpapers</span>
                    <Download className="group-hover:translate-y-1 transition-transform" size={20} />
                  </span>
                </button>
                
                <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-gray-200 dark:border-gray-700">
                  Learn More
                </button>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">10k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wallpapers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">50k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9★</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Visual Element */}
            <div className="relative hidden md:block">
              <div className="relative w-full h-[500px]">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
                
                {/* Sample wallpaper preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white dark:fill-gray-950">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find the perfect wallpaper for your style
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.filter(cat => cat !== "All").map((category, idx) => {
            const categoryImages = {
              Nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
              Abstract: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800",
              Cars: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
              Anime: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800"
            };
            
            const gradients = [
              "from-green-500 to-emerald-500",
              "from-purple-500 to-pink-500",
              "from-orange-500 to-red-500",
              "from-blue-500 to-cyan-500"
            ];
            
            return (
              <div
                key={category}
                onClick={() => onCategoryClick(category)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <img 
                  src={categoryImages[category]} 
                  alt={category}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx]} opacity-60 group-hover:opacity-40 transition-opacity`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-3xl font-bold mb-2 transform group-hover:scale-110 transition-transform">
                    {category}
                  </h3>
                  <p className="text-sm opacity-90">Click to explore</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <button 
            onClick={onViewAllClick}
            className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center space-x-2">
              <Download size={20} />
              <span>Download Now</span>
            </span>
          </button>
        </div>
      </section>

      {/* Trending Downloads Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="text-red-500" size={32} />
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Trending Downloads
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Most popular wallpapers this week
              </p>
            </div>
            
            <button 
              onClick={onViewAllClick}
              className="hidden md:block text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg"
            >
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingWallpapers.map((wallpaper, idx) => (
              <div key={wallpaper.id} className="relative">
                {/* Trending badge */}
                {idx < 3 && (
                  <div className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    #{idx + 1} Trending
                  </div>
                )}
                <WallpaperCard
                  wallpaper={wallpaper}
                  onClick={() => onWallpaperClick(wallpaper)}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 md:hidden">
            <button 
              onClick={onViewAllClick}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg"
            >
              View All →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;