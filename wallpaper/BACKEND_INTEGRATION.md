# Wallpaper App - Backend Integration

## Overview
This React frontend has been fully integrated with the FastAPI backend to provide real-time wallpaper data, user authentication, and Google Drive integration.

## Backend Integration Features

### 🔐 Authentication
- **User Registration & Login**: JWT-based authentication
- **Protected Routes**: Admin-only features for wallpaper management
- **Session Management**: Automatic token refresh and logout

### 🖼️ Wallpaper Management
- **Real-time Data**: Fetches wallpapers from MongoDB via FastAPI
- **Google Drive Integration**: Images stored and served from Google Drive
- **Like System**: Users can like/unlike wallpapers
- **Download Tracking**: Automatic download count increment

### 📱 Frontend Features
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Comprehensive error management
- **Responsive Design**: Works on all device sizes
- **Dark/Light Theme**: Maintained theme switching

## API Endpoints Used

### Authentication
- `POST /users/` - User registration
- `POST /token` - User login
- `GET /users/me` - Get current user

### Wallpapers
- `GET /wallpapers/` - Get all wallpapers
- `GET /wallpapers/category/{category}` - Get wallpapers by category
- `POST /wallpapers/{id}/like` - Like/unlike wallpaper
- `POST /wallpapers/{id}/download` - Track download

### Admin (Protected)
- `GET /admin/categories/` - Get all categories
- `POST /admin/categories/` - Create new category
- `POST /admin/upload/` - Upload new wallpaper

## Setup Instructions

### 1. Backend Setup
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd wallpaper
npm install
npm start
```

### 3. Environment Configuration
Create a `.env` file in the wallpaper directory:
```
REACT_APP_API_URL=http://localhost:8000
```

## Key Components

### API Service (`src/services/api.js`)
- Centralized API calls
- Error handling
- Authentication headers
- Google Drive URL generation

### Authentication Context (`src/context/AuthContext.js`)
- User state management
- Login/logout functionality
- Protected route handling

### Custom Hooks (`src/hooks/useApi.js`)
- `useWallpapers()` - Fetch wallpapers with pagination
- `useCategories()` - Fetch categories
- `useWallpaperActions()` - Like/download actions

### Updated Components
- **Header**: Added user menu and authentication
- **WallpaperCard**: Added like/download functionality
- **HomePage**: Added loading states
- **AllWallpapersPage**: Added loading states

## Features Implemented

✅ **Real-time Data Fetching**
✅ **User Authentication**
✅ **Like/Unlike System**
✅ **Download Tracking**
✅ **Loading States**
✅ **Error Handling**
✅ **Google Drive Integration**
✅ **Responsive Design**
✅ **Theme Support**

## Testing the Integration

1. Start the backend server
2. Start the frontend development server
3. Register a new user account
4. Browse wallpapers and test like/download functionality
5. Check that data persists in MongoDB

The frontend now fully integrates with the backend API, providing a complete wallpaper management system with user authentication and real-time data.
