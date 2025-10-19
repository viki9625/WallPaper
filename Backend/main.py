# main.py
# DESCRIPTION:
# This version is updated to save and retrieve the full, direct Google Drive
# image URL instead of just the file ID.

import os
import hashlib
import pickle
from datetime import datetime, timedelta, timezone
from typing import List, Optional
import motor.motor_asyncio
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv

from fastapi import Depends, FastAPI, HTTPException, status, Form, UploadFile, File
from fastapi.concurrency import run_in_threadpool
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

# Google Drive API Imports
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from io import BytesIO

# --- Configuration ---
load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
GOOGLE_DRIVE_FOLDER_ID = os.getenv("GOOGLE_DRIVE_FOLDER_ID")

SCOPES = ['https://www.googleapis.com/auth/drive.file']

# --- Database Setup ---
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.chitrashala
user_collection = database.get_collection("users")
wallpaper_collection = database.get_collection("wallpapers")
category_collection = database.get_collection("categories")

# --- Google Drive Service Helper ---
def blocking_get_drive_creds():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0) 
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    return creds

async def get_drive_service():
    creds = await run_in_threadpool(blocking_get_drive_creds)
    return build('drive', 'v3', credentials=creds)

# --- Pydantic Schemas ---
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v): raise ValueError("Invalid objectid")
        return ObjectId(v)
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel): email: EmailStr
class UserCreate(UserBase): password: str
class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    role: str = "user"
    class Config:
        json_encoders = {ObjectId: str}
        orm_mode = True
        allow_population_by_field_name = True

class UserAuth(UserInDB): hashed_password: str
class Token(BaseModel): access_token: str; token_type: str
class CategorySchema(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    class Config:
        json_encoders = {ObjectId: str}
        orm_mode = True
        allow_population_by_field_name = True

class WallpaperPublic(BaseModel):
    id: str; title: str; description: Optional[str] = None; category_name: str
    likes_count: int; download_count: int
    # CHANGED: The field now represents the full URL
    google_drive_file_url: str

class WallpaperAdmin(WallpaperPublic):
    upload_date: datetime
    category_id: str

# --- Security & Authentication ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if len(plain_password.encode('utf-8')) > 72:
        plain_password = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    if len(password.encode('utf-8')) > 72:
        password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await user_collection.find_one({"email": email})
    if user is None: raise credentials_exception
    return UserAuth(**user)

async def get_current_admin_user(current_user: UserAuth = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user

# --- FastAPI App Initialization ---
app = FastAPI(title="Chitrashala API with Google Drive", version="3.2-full-links")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.post("/users/", response_model=UserInDB, tags=["Authentication"], summary="Register a new user", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    if await user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = {"email": user.email, "hashed_password": hashed_password, "role": "user"}
    result = await user_collection.insert_one(new_user)
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    return created_user

@app.post("/token", response_model=Token, tags=["Authentication"], summary="Login to get an access token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(data={"sub": user["email"], "role": user.get("role", "user")})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserInDB, tags=["Users"], summary="Get details for the current logged-in user")
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user

@app.get("/wallpapers/", response_model=List[WallpaperPublic], tags=["Wallpapers"], summary="Get all wallpapers")
async def get_all_wallpapers(skip: int = 0, limit: int = 50):
    wallpapers_cursor = wallpaper_collection.find().sort("upload_date", -1).skip(skip).limit(limit)
    response = []
    async for wallpaper in wallpapers_cursor:
        category = await category_collection.find_one({"_id": wallpaper["category_id"]})
        response.append(WallpaperPublic(
            id=str(wallpaper["_id"]),
            title=wallpaper["title"],
            description=wallpaper.get("description"),
            category_name=category["name"] if category else "Uncategorized",
            likes_count=len(wallpaper.get("likes", [])),
            download_count=wallpaper.get("download_count", 0),
            google_drive_file_url=wallpaper["google_drive_file_url"] # CHANGED
        ))
    return response

@app.get("/wallpapers/category/{category_name}", response_model=List[WallpaperPublic], tags=["Wallpapers"], summary="Get wallpapers by category name")
async def get_wallpapers_by_category(category_name: str, skip: int = 0, limit: int = 50):
    category = await category_collection.find_one({"name": {"$regex": f"^{category_name}$", "$options": "i"}})
    if not category:
        raise HTTPException(status_code=404, detail=f"Category '{category_name}' not found")

    wallpapers_cursor = wallpaper_collection.find({"category_id": category["_id"]}).sort("upload_date", -1).skip(skip).limit(limit)
    response = []
    async for wallpaper in wallpapers_cursor:
        response.append(WallpaperPublic(
            id=str(wallpaper["_id"]),
            title=wallpaper["title"],
            description=wallpaper.get("description"),
            category_name=category["name"],
            likes_count=len(wallpaper.get("likes", [])),
            download_count=wallpaper.get("download_count", 0),
            google_drive_file_url=wallpaper["google_drive_file_url"]
        ))
    return response

@app.post("/wallpapers/{wallpaper_id}/like", tags=["Wallpapers"], summary="Like or unlike a wallpaper")
async def like_wallpaper(wallpaper_id: str, current_user: UserAuth = Depends(get_current_user)):
    try:
        user_id_obj = ObjectId(current_user.id)
        wallpaper_id_obj = ObjectId(wallpaper_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    wallpaper = await wallpaper_collection.find_one({"_id": wallpaper_id_obj})
    if not wallpaper:
        raise HTTPException(status_code=404, detail="Wallpaper not found")

    if user_id_obj in wallpaper.get("likes", []):
        await wallpaper_collection.update_one({"_id": wallpaper_id_obj}, {"$pull": {"likes": user_id_obj}})
        message = "Wallpaper unliked"
    else:
        await wallpaper_collection.update_one({"_id": wallpaper_id_obj}, {"$addToSet": {"likes": user_id_obj}})
        message = "Wallpaper liked"

    return {"status": "success", "message": message}

@app.post("/wallpapers/{wallpaper_id}/download", tags=["Wallpapers"], summary="Increment download count for a wallpaper")
async def increment_download_count(wallpaper_id: str):
    try:
        wallpaper_id_obj = ObjectId(wallpaper_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Wallpaper ID format")

    result = await wallpaper_collection.update_one(
        {"_id": wallpaper_id_obj},
        {"$inc": {"download_count": 1}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Wallpaper not found")

    return {"status": "success", "message": "Download count incremented"}

# --- ADMIN Endpoints ---
@app.post("/admin/upload/", tags=["Admin"], summary="Upload a new wallpaper to Google Drive")
async def upload_wallpaper_to_drive(
    title: str = Form(...),
    description: str = Form(...),
    category_id: str = Form(...),
    image: UploadFile = File(...),
    current_admin: UserAuth = Depends(get_current_admin_user)
):
    try:
        category_obj_id = ObjectId(category_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Category ID format.")
    
    category = await category_collection.find_one({"_id": category_obj_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found for the provided ID.")

    try:
        service = await get_drive_service()
        sanitized_title = "".join(c for c in title if c.isalnum() or c in (' ', '_')).rstrip()
        unique_filename = f"{sanitized_title}_{int(datetime.now(timezone.utc).timestamp())}"
        
        file_metadata = { 'name': unique_filename, 'parents': [GOOGLE_DRIVE_FOLDER_ID] }
        
        image_bytes = await image.read()
        
        def blocking_upload():
            fh = BytesIO(image_bytes)
            media = MediaIoBaseUpload(fh, mimetype=image.content_type, resumable=True)
            
            file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
            
            # ** NEW CHANGE HERE **
            # After getting the ID, make the file public and construct the direct link
            file_id = file.get('id')
            # FIX: Use the correct role 'reader' to make the file publicly viewable
            service.permissions().create(fileId=file_id, body={'role': 'reader', 'type': 'anyone'}).execute()
            
            # This URL format is for direct image viewing/embedding
            return f"https://drive.google.com/uc?export=view&id={file_id}"

        google_drive_file_url = await run_in_threadpool(blocking_upload)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload to Google Drive: {e}")

    new_wallpaper = {
        "title": title, "description": description, "category_id": category_obj_id,
        "google_drive_file_url": google_drive_file_url, # CHANGED: Save the full URL
        "likes": [], "download_count": 0,
        "upload_date": datetime.now(timezone.utc)
    }
    result = await wallpaper_collection.insert_one(new_wallpaper)
    return {"status": "success", "message": "Wallpaper uploaded", "wallpaper_id": str(result.inserted_id), "google_drive_file_url": google_drive_file_url}

@app.get("/categories/", response_model=List[CategorySchema], tags=["Wallpapers"], summary="Get all existing categories (public)")
async def get_all_categories_public():
    categories = await category_collection.find().to_list(1000)
    return categories

