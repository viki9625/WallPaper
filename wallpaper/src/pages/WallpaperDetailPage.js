import React from 'react';
import { useParams } from 'react-router-dom';

const WallpaperDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-2">Wallpaper Detail</h2>
      <p className="text-gray-600">ID: {id}</p>
    </div>
  );
};

export default WallpaperDetailPage;
