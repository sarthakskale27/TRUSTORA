import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'trustora-production-super-secret-key-2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'trustora-jwt-secret-token-key-2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Supabase / PostgreSQL Support with local SQLite fallback
    DATABASE_URL = os.getenv('DATABASE_URL')
    if DATABASE_URL and DATABASE_URL.strip():
        # Standardize postgres:// prefix to postgresql:// for SQLAlchemy compatibility
        if DATABASE_URL.startswith('postgres://'):
            DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
            
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,
            'pool_recycle': 300,
            'connect_args': {
                'connect_timeout': 10
            }
        }
    else:
        # Local SQLite fallback
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'trustora.db')
        SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'
        SQLALCHEMY_ENGINE_OPTIONS = {}
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    CORS_HEADERS = 'Content-Type'
    
    LLM_API_KEY = os.getenv('LLM_API_KEY', '')
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', '')
