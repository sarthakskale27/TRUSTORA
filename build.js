const { execSync } = require('child_process');
const fs = require('fs');

if (fs.existsSync('frontend') && fs.existsSync('frontend/package.json')) {
  console.log('[Build] Detected root directory. Building inside frontend/ ...');
  execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
  if (fs.existsSync('frontend/dist')) {
    if (!fs.existsSync('dist')) fs.mkdirSync('dist', { recursive: true });
    // Copy dist to root dist so Vercel finds it anywhere
    fs.cpSync('frontend/dist', 'dist', { recursive: true });
  }
} else {
  console.log('[Build] Building Vite directly in current directory...');
  execSync('npx vite build', { stdio: 'inherit' });
}
