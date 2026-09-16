# HostBoost AI Full Frontend Generator
import os

BASE = 'C:/Users/Sarthak/.gemini/antigravity/scratch/hostboost-ai/frontend'

def save(rel, content):
    p = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Generated:', rel)

