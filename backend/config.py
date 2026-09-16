import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'hostboost-production-super-secret-key-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'hostboost-jwt-secret-token-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Supabase / PostgreSQL Support with local SQLite fallback
    DATABASE_URL = os.getenv('DATABASE_URL')
    if DATABASE_URL:
        # Standardize postgres:// prefix to postgresql:// for SQLAlchemy compatibility
        if DATABASE_URL.startswith('postgres://'):
            DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Local SQLite fallback
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'hostboost.db')
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    CORS_HEADERS = 'Content-Type'
    
    # Optional LLM / Maps API keys
    LLM_API_KEY = os.getenv('LLM_API_KEY', '')
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', '')
