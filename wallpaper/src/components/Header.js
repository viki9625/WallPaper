import React, { useState } from 'react';
import { Moon, Sun, Search, Menu, Home, Grid } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onSearchClick, onCategoryClick, onLogoClick }) => {
  const { isDark, setIsDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <h1 
              onClick={onLogoClick}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
            >
              FreeWallz
            </h1>
            
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={onLogoClick}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <Home size={18} />
                <span>Home</span>
              </button>
              <button 
                onClick={onCategoryClick}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <Grid size={18} />
                <span>Categories</span>
              </button>
            </nav>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Search"
            >
              <Search className="text-gray-700 dark:text-gray-300" size={20} />
            </button>
            
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-gray-700" size={20} />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Menu"
            >
              <Menu className="text-gray-700 dark:text-gray-300" size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => {
                onLogoClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button 
              onClick={() => {
                onCategoryClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <Grid size={18} />
              <span>Categories</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
