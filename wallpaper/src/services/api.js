// API service for backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Authentication API
export const authApi = {
  async register(email, password) {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    return handleResponse(response);
  },

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};

// Wallpapers API
export const wallpapersApi = {
  async getAll(skip = 0, limit = 50) {
    const response = await fetch(`${API_BASE_URL}/wallpapers/?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  async getByCategory(categoryName, skip = 0, limit = 50) {
    const response = await fetch(`${API_BASE_URL}/wallpapers/category/${encodeURIComponent(categoryName)}?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  async like(wallpaperId) {
    const response = await fetch(`${API_BASE_URL}/wallpapers/${wallpaperId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async download(wallpaperId) {
    const response = await fetch(`${API_BASE_URL}/wallpapers/${wallpaperId}/download`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Helper: Convert a Google Drive view URL to a direct download URL
  // Supports formats like:
  // - https://drive.google.com/uc?export=view&id=FILE_ID
  // - https://drive.google.com/file/d/FILE_ID/view
  getDownloadUrlFromFileUrl(fileUrl) {
    if (!fileUrl) return '';
    try {
      // Extract FILE_ID from common patterns
      const idFromUc = /[?&]id=([a-zA-Z0-9_-]+)/.exec(fileUrl)?.[1];
      const idFromPath = /\/file\/d\/([a-zA-Z0-9_-]+)/.exec(fileUrl)?.[1];
      const fileId = idFromUc || idFromPath;
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
      // Fallback: if already a uc link, just replace export=view with export=download
      return fileUrl.replace('export=view', 'export=download');
    } catch {
      return fileUrl;
    }
  },

  // For now preview can use the given URL directly
  getPreviewFromFileUrl(fileUrl) {
    return fileUrl || '';
  },

  // Extract Google Drive file ID from a file URL
  getFileIdFromFileUrl(fileUrl) {
    if (!fileUrl) return '';
    const fromUc = /[?&]id=([a-zA-Z0-9_-]+)/.exec(fileUrl)?.[1];
    const fromPath = /\/file\/d\/([a-zA-Z0-9_-]+)/.exec(fileUrl)?.[1];
    return fromUc || fromPath || '';
  },

  // Build a Google Drive thumbnail URL for faster/safer embedding
  getThumbnailFromFileUrl(fileUrl, size = 800) {
    const fileId = this.getFileIdFromFileUrl(fileUrl);
    if (!fileId) return fileUrl || '';
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  }
};

// Categories API
export const categoriesApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    return handleResponse(response);
  },

  async create(name) {
    const formData = new FormData();
    formData.append('name', name);

    const response = await fetch(`${API_BASE_URL}/admin/categories/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    return handleResponse(response);
  }
};

// Admin API
export const adminApi = {
  async getAllWallpapers() {
    const response = await fetch(`${API_BASE_URL}/admin/wallpapers/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async uploadWallpaper(title, description, categoryId, imageFile) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/admin/upload/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData
    });
    return handleResponse(response);
  }
};

// Combined API service for easy use
export const api = {
  auth: authApi,
  wallpapers: wallpapersApi,
  categories: categoriesApi,
  admin: adminApi
};

export default api;
