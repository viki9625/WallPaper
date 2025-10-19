export const mockWallpapers = [
  {
    id: 1,
    title: "Mountain Sunset",
    category: "Nature",
    tags: ["sunset", "mountains", "landscape"],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    downloadUrl: "https://drive.google.com/file/d/example1"
  },
  {
    id: 2,
    title: "Abstract Waves",
    category: "Abstract",
    tags: ["abstract", "colorful", "waves"],
    imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800",
    downloadUrl: "https://drive.google.com/file/d/example2"
  },
  {
    id: 3,
    title: "Sports Car",
    category: "Cars",
    tags: ["car", "sports", "luxury"],
    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
    downloadUrl: "https://drive.google.com/file/d/example3"
  },
  {
    id: 4,
    title: "Anime Girl",
    category: "Anime",
    tags: ["anime", "art", "character"],
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
    downloadUrl: "https://drive.google.com/file/d/example4"
  },
  {
    id: 5,
    title: "Forest Path",
    category: "Nature",
    tags: ["forest", "trees", "nature"],
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    downloadUrl: "https://drive.google.com/file/d/example5"
  },
  {
    id: 6,
    title: "Neon Lights",
    category: "Abstract",
    tags: ["neon", "lights", "city"],
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
    downloadUrl: "https://drive.google.com/file/d/example6"
  },
  {
    id: 7,
    title: "Ocean Waves",
    category: "Nature",
    tags: ["ocean", "waves", "sea"],
    imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    downloadUrl: "https://drive.google.com/file/d/example7"
  },
  {
    id: 8,
    title: "Muscle Car",
    category: "Cars",
    tags: ["car", "classic", "vintage"],
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    downloadUrl: "https://drive.google.com/file/d/example8"
  },
  {
    id: 9,
    title: "Cherry Blossoms",
    category: "Nature",
    tags: ["flowers", "spring", "pink"],
    imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800",
    downloadUrl: "https://drive.google.com/file/d/example9"
  },
  {
    id: 10,
    title: "Geometric Art",
    category: "Abstract",
    tags: ["geometric", "patterns", "modern"],
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
    downloadUrl: "https://drive.google.com/file/d/example10"
  },
  {
    id: 11,
    title: "Racing Car",
    category: "Cars",
    tags: ["racing", "speed", "track"],
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
    downloadUrl: "https://drive.google.com/file/d/example11"
  },
  {
    id: 12,
    title: "Anime Landscape",
    category: "Anime",
    tags: ["anime", "scenery", "sunset"],
    imageUrl: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800",
    downloadUrl: "https://drive.google.com/file/d/example12"
  }
];

// Simple mock API service simulating backend fetches and delay
export const api = {
  async getTrending() {
    await new Promise(r => setTimeout(r, 250));
    return mockWallpapers.slice(0, 8);
  },
  async getAll({ category = 'All', page = 1, pageSize = 12, query = '' } = {}) {
    await new Promise(r => setTimeout(r, 250));
    let list = [...mockWallpapers];
    if (category && category !== 'All') {
      list = list.filter(w => w.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      items: list.slice(start, end),
      total: list.length,
      hasMore: end < list.length,
    };
  },
  async getById(id) {
    await new Promise(r => setTimeout(r, 150));
    return mockWallpapers.find(w => String(w.id) === String(id)) || null;
  },
  async getRelated(id) {
    await new Promise(r => setTimeout(r, 150));
    const current = mockWallpapers.find(w => String(w.id) === String(id));
    if (!current) return [];
    return mockWallpapers
      .filter(w => w.id !== current.id && (w.category === current.category || w.tags.some(t => current.tags.includes(t))))
      .slice(0, 8);
  }
};

export const categories = ["All", "Nature", "Abstract", "Cars", "Anime"];