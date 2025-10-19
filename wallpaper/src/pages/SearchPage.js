import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useWallpapers } from '../hooks/useApi';
import WallpaperCard from '../components/WallpaperCard';

const SearchPage = () => {
  const { wallpapers, loading } = useWallpapers('All', 0, 200);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return wallpapers;
    const q = query.toLowerCase();
    return wallpapers.filter(w =>
      (w.title || '').toLowerCase().includes(q) ||
      (w.category || '').toLowerCase().includes(q) ||
      (w.tags || []).some(t => (t || '').toLowerCase().includes(q))
    );
  }, [query, wallpapers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search wallpapers by name, tag, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 border-b border-gray-200 dark:border-gray-800 py-2"
          autoFocus
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {query ? `Found ${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : `Showing ${filtered.length} wallpapers`}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(w => (
              <WallpaperCard key={w.id} wallpaper={w} onClick={() => {}} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
