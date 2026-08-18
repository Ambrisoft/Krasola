import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const pkgPath = path.resolve(rootDir, 'package.json');
const swPath = path.resolve(rootDir, 'public', 'sw.js');
const versionManagerPath = path.resolve(rootDir, 'src', 'utils', 'versionManager.js');
const versionJsonPath = path.resolve(rootDir, 'public', 'version.json');

// 1. Read Current Package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const currentVersion = pkg.version || '1.0.0';
const [major, minor, patch] = currentVersion.split('.').map(Number);

// 2. Determine Version Bump Type
const arg = process.argv[2] || '--sync';
let bumpType = 'sync'; // 'patch' | 'minor' | 'major' | 'sync'

if (arg === '--patch') bumpType = 'patch';
else if (arg === '--minor') bumpType = 'minor';
else if (arg === '--major') bumpType = 'major';
else if (arg === '--auto') {
  try {
    const lastCommitMsg = execSync('git log -1 --pretty=%B', { cwd: rootDir }).toString().trim().toLowerCase();
    if (lastCommitMsg.includes('breaking') || lastCommitMsg.includes('feat!:') || lastCommitMsg.includes('fix!:')) {
      bumpType = 'major';
    } else if (lastCommitMsg.startsWith('feat') || lastCommitMsg.includes('feat(')) {
      bumpType = 'minor';
    } else {
      bumpType = 'patch';
    }
  } catch {
    bumpType = 'patch';
  }
}

// 3. Calculate New Version
let newVersion = currentVersion;
if (bumpType === 'major') {
  newVersion = `${major + 1}.0.0`;
} else if (bumpType === 'minor') {
  newVersion = `${major}.${minor + 1}.0`;
} else if (bumpType === 'patch') {
  newVersion = `${major}.${minor}.${patch + 1}`;
}

// 4. Get Current Git Commit Hash & Timestamp
let commitHash = 'main';
try {
  commitHash = execSync('git rev-parse --short HEAD', { cwd: rootDir }).toString().trim();
} catch {
  commitHash = `v${newVersion}`;
}
const buildTime = new Date().toISOString();

// 5. Update package.json
if (newVersion !== currentVersion) {
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`[Auto-Version] 🚀 Bumped version: ${currentVersion} ➔ ${newVersion} (${bumpType.toUpperCase()})`);
} else {
  console.log(`[Auto-Version] 🔄 Synced version: ${newVersion} (Commit: ${commitHash})`);
}

// 6. Update Service Worker Cache Key (public/sw.js)
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(
    /const CACHE_NAME = 'krasola-pwa-v[^']+';/,
    `const CACHE_NAME = 'krasola-pwa-v${newVersion}';`
  );
  fs.writeFileSync(swPath, swContent);
}

// 7. Update src/utils/versionManager.js Fallback
if (fs.existsSync(versionManagerPath)) {
  let vmContent = fs.readFileSync(versionManagerPath, 'utf8');
  vmContent = vmContent.replace(
    /export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' \? __APP_VERSION__ : '[^']+';/,
    `export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '${newVersion}';`
  );
  fs.writeFileSync(versionManagerPath, vmContent);
}

// 8. Update public/version.json
const versionData = {
  name: "Krasola Multi-Utility Workspace",
  version: newVersion,
  commit: commitHash,
  builtAt: buildTime,
  environment: "production"
};
const publicDir = path.resolve(rootDir, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2) + '\n');

console.log(`[Auto-Version] ✅ Synchronized all manifests & caches to v${newVersion}`);
