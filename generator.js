/** Generator Script */
const fs = require('fs');
const path = require('path');

function write(relPath, content) {
  const fullPath = path.join('C:/Users/Sarthak/.gemini/antigravity/scratch/hostboost-ai/frontend', relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Wrote: ' + relPath);
}

module.exports = { write };
