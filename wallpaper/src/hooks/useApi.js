import { useState, useEffect, useCallback } from 'react';
import { wallpapersApi, categoriesApi } from '../services/api';

export const useWallpapers = (category = 'All', skip = 0, limit = 50) => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchWallpapers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (category === 'All') {
        data = await wallpapersApi.getAll(skip, limit);
      } else {
        data = await wallpapersApi.getByCategory(category, skip, limit);
      }
      
      // Handle empty response
      if (!data || !Array.isArray(data)) {
        setWallpapers([]);
        setHasMore(false);
        return;
      }
      
      // Transform data to match frontend format
      const transformedData = data.map(wallpaper => {
        // Backward compatibility: support older payloads that may have google_drive_file_id
        const fileUrl = wallpaper.google_drive_file_url || (wallpaper.google_drive_file_id
          ? `https://drive.google.com/uc?export=view&id=${wallpaper.google_drive_file_id}`
          : '');
        // Prefer Drive thumbnail for reliability
        const previewUrl = wallpapersApi.getThumbnailFromFileUrl(fileUrl);
        const downloadUrl = wallpapersApi.getDownloadUrlFromFileUrl(fileUrl);
        return {
          id: wallpaper.id,
          title: wallpaper.title,
          category: wallpaper.category_name,
          description: wallpaper.description,
          imageUrl: previewUrl,
          downloadUrl: downloadUrl,
          likesCount: wallpaper.likes_count,
          downloadCount: wallpaper.download_count,
          tags: wallpaper.description ? wallpaper.description.split(' ').slice(0, 3) : []
        };
      });

      setWallpapers(transformedData);
      setHasMore(data.length === limit);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching wallpapers:', err);
      setWallpapers([]);
    } finally {
      setLoading(false);
    }
  }, [category, skip, limit]);

  useEffect(() => {
    fetchWallpapers();
  }, [fetchWallpapers]);

  return { wallpapers, loading, error, hasMore, refetch: fetchWallpapers };
};

export const useCategories = () => {
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesApi.getAll();
      
      // Handle empty response
      if (!data || !Array.isArray(data)) {
        setCategories(['All', 'Nature', 'Abstract', 'Cars', 'Anime']);
        return;
      }
      
      const categoryNames = ['All', ...data.map(cat => cat.name)];
      setCategories(categoryNames);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
      // Fallback to default categories
      setCategories(['All', 'Nature', 'Abstract', 'Cars', 'Anime']);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

export const useWallpaperActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const likeWallpaper = async (wallpaperId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await wallpapersApi.like(wallpaperId);
      return { success: true, message: result.message };
    } catch (err) {
      const errorMessage = err.data?.detail || 'Failed to like wallpaper';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const downloadWallpaper = async (wallpaperId) => {
    try {
      setLoading(true);
      setError(null);
      await wallpapersApi.download(wallpaperId);
      return { success: true };
    } catch (err) {
      const errorMessage = err.data?.detail || 'Failed to download wallpaper';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { likeWallpaper, downloadWallpaper, loading, error };
};
