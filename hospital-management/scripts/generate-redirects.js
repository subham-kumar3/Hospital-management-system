const fs = require('fs');
const path = require('path');

const loadEnvFiles = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const root = path.join(__dirname, '..');

  for (const file of [
    `.env.${nodeEnv}.local`,
    `.env.${nodeEnv}`,
    '.env.local',
    '.env'
  ]) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;

    for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
};

loadEnvFiles();

const apiUrl = process.env.VITE_API_URL || '';
const isProductionBuild =
  process.env.NODE_ENV === 'production'
  || process.env.NETLIFY === 'true'
  || process.env.CONTEXT === 'production'
  || process.env.CONTEXT === 'deploy-preview';

const isPlaceholder = (url) =>
  !url || url.includes('REPLACE-WITH-YOUR') || url.includes('your-backend');

const lines = [];

if (apiUrl && isPlaceholder(apiUrl)) {
  console.error('');
  console.error('❌ BUILD FAILED: VITE_API_URL still has placeholder value.');
  console.error(`   Current value: ${apiUrl}`);
  console.error('');
  console.error('   Fix: Netlify → Site settings → Environment variables');
  console.error('   Key:   VITE_API_URL');
  console.error('   Value: https://your-backend.onrender.com');
  console.error('');
  process.exit(1);
}

if (apiUrl && !isPlaceholder(apiUrl)) {
  const base = apiUrl.trim().replace(/\/$/, '').replace(/\/api$/, '');
  lines.push(`/api/*  ${base}/api/:splat  200`);
  console.log(`✅ VITE_API_URL configured → ${base}`);
  console.log(`✅ Netlify API proxy → ${base}/api/:splat`);
} else if (isProductionBuild) {
  console.error('');
  console.error('❌ BUILD FAILED: VITE_API_URL is not set for production.');
  console.error('');
  console.error('   Netlify → Site settings → Environment variables → Add:');
  console.error('   ┌─────────────────┬──────────────────────────────────────────┐');
  console.error('   │ Key             │ Value                                    │');
  console.error('   ├─────────────────┼──────────────────────────────────────────┤');
  console.error('   │ VITE_API_URL    │ https://your-backend.onrender.com        │');
  console.error('   │ NODE_ENV        │ production                               │');
  console.error('   └─────────────────┴──────────────────────────────────────────┘');
  console.error('');
  console.error('   Then: Deploys → Trigger deploy → Deploy site');
  console.error('');
  process.exit(1);
} else {
  console.log('ℹ️  Local dev mode: VITE_API_URL not needed (Vite proxy uses localhost:5001).');
}

lines.push('/*    /index.html   200');

const dest = path.join(__dirname, '../public/_redirects');
fs.writeFileSync(dest, `${lines.join('\n')}\n`);
console.log(`✅ Generated ${dest}`);
