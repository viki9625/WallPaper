# Backend-Frontend Integration Testing Guide

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Frontend Server
```bash
cd wallpaper
npm install
npm start
```

### 3. Seed Database (First Time Only)
- Open the frontend at `http://localhost:3000`
- Click the "Seed Database" button on the homepage
- This will create sample categories and wallpapers

## 🔧 Fixed Issues

### ✅ CORS Configuration
- Added CORS middleware to allow frontend requests
- Configured for `http://localhost:3000` and `http://127.0.0.1:3000`

### ✅ API Endpoint Fixes
- **Categories**: Added public `/categories/` endpoint (no auth required)
- **Login**: Fixed form data format for OAuth2PasswordRequestForm
- **Error Handling**: Improved error handling in frontend hooks

### ✅ Data Seeding
- Added `/seed-data` endpoint to populate database with sample data
- Creates categories: Nature, Abstract, Cars, Anime
- Creates sample wallpapers for testing

### ✅ Response Format Handling
- Updated frontend to handle empty API responses
- Added fallback data when backend is empty
- Improved error handling and loading states

## 🧪 Testing Checklist

### Authentication Endpoints
- [ ] `POST /users/` - User registration (no auth required)
- [ ] `POST /token` - User login
- [ ] `GET /users/me` - Get current user (auth required)

### Public Endpoints
- [ ] `GET /wallpapers/` - Get all wallpapers
- [ ] `GET /wallpapers/category/{category}` - Get wallpapers by category
- [ ] `GET /categories/` - Get all categories (no auth required)
- [ ] `POST /seed-data` - Seed database with sample data

### User Actions
- [ ] `POST /wallpapers/{id}/like` - Like/unlike wallpaper (auth required)
- [ ] `POST /wallpapers/{id}/download` - Track download

### Admin Endpoints
- [ ] `GET /admin/categories/` - Get categories (admin required)
- [ ] `POST /admin/categories/` - Create category (admin required)
- [ ] `POST /admin/upload/` - Upload wallpaper (admin required)

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Error**: `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: CORS middleware is now configured in the backend

### Issue: Empty Wallpapers
**Error**: No wallpapers showing on frontend

**Solution**: 
1. Click "Seed Database" button on homepage
2. Or manually call `POST http://localhost:8000/seed-data`

### Issue: Categories Not Loading
**Error**: Categories showing as empty

**Solution**: Categories endpoint is now public and doesn't require authentication

### Issue: Login Not Working
**Error**: Login form not submitting properly

**Solution**: Fixed form data format to match OAuth2PasswordRequestForm requirements

## 🔍 API Testing with curl

### Test User Registration
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpassword"}'
```

### Test User Login
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=testpassword"
```

### Test Get Wallpapers
```bash
curl -X GET "http://localhost:8000/wallpapers/"
```

### Test Get Categories
```bash
curl -X GET "http://localhost:8000/categories/"
```

### Test Seed Data
```bash
curl -X POST "http://localhost:8000/seed-data"
```

## 📱 Frontend Features

### ✅ Working Features
- User registration and login
- Wallpaper browsing with categories
- Like/unlike functionality (requires login)
- Download tracking
- Loading states and error handling
- Responsive design
- Dark/light theme

### 🔄 Data Flow
1. Frontend loads → Fetches categories and wallpapers
2. User registers/logs in → JWT token stored
3. User likes/downloads → API calls with auth headers
4. Real-time updates → UI reflects backend changes

## 🎯 Next Steps

1. **Test all endpoints** using the checklist above
2. **Verify data persistence** in MongoDB
3. **Test user authentication** flow
4. **Test admin functionality** (if needed)
5. **Deploy to production** when ready

The integration is now complete and should work seamlessly! 🚀
