import os

BASE = 'C:/Users/Sarthak/.gemini/antigravity/scratch/hostboost-ai/frontend'

def write_file(rel, content):
    full = os.path.join(BASE, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Generated:', rel)

