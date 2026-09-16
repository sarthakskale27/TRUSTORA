# Builder for HostBoost AI Backend
import os

base = r'C:/Users/Sarthak/.gemini/antigravity/scratch/hostboost-ai/backend'
os.makedirs(f'{base}/routes', exist_ok=True)
os.makedirs(f'{base}/services', exist_ok=True)
os.makedirs(f'{base}/uploads', exist_ok=True)

print('Base directories verified')
