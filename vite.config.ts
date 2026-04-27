import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// `base` is configurable via the `VITE_BASE_PATH` env var so the same build
// can be deployed both to GitHub Pages (under a subpath like
// `/speakerporfolioresume/`) and to a generic React frontend host (Netlify,
// Vercel, S3, …) at the site root.
declare const process: { cwd(): string }

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/'
  return {
    base,
    plugins: [react()],
  }
})
