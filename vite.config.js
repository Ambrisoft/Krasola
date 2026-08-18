import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'))

let commitHash = 'main'
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {
  commitHash = 'v' + pkg.version
}

const buildTime = new Date().toISOString()

// Custom plugin to ensure public/version.json is updated on each build
function generateVersionJsonPlugin() {
  return {
    name: 'generate-version-json',
    buildStart() {
      const versionData = {
        name: "Krasola Multi-Utility Workspace",
        version: pkg.version,
        commit: commitHash,
        builtAt: buildTime,
        environment: "production"
      }
      const publicDir = path.resolve(__dirname, 'public')
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }
      fs.writeFileSync(
        path.resolve(publicDir, 'version.json'),
        JSON.stringify(versionData, null, 2)
      )
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), generateVersionJsonPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_TIMESTAMP__: JSON.stringify(buildTime),
    __APP_STAGE__: JSON.stringify('Production')
  },
  server: {
    port: 3000,
    open: true
  }
})
