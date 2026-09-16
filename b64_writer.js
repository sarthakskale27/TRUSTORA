const fs = require('fs');
const path = require('path');
const [relPath, b64] = process.argv.slice(2);
const fullPath = path.join('C:/Users/Sarthak/.gemini/antigravity/scratch/hostboost-ai/frontend', relPath);
fs.mkdirSync(path.dirname(fullPath), { recursive: true });
fs.writeFileSync(fullPath, Buffer.from(b64, 'base64').toString('utf8'), 'utf8');
console.log('Wrote: ' + relPath);
