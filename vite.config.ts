import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const projectDir = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8')) as {
  version: string
}

/** TanStack Start emits `from './router.tsx'`; strip to extensionless imports. */
function stripRouteTreeGenImportExtensions(): Plugin {
  const routeTreePath = path.join(projectDir, 'src/routeTree.gen.ts')
  return {
    name: 'strip-route-tree-gen-import-extensions',
    // Run after TanStack route generation (Vite invokes `closeBundle` in reverse
    // plugin order, so this plugin is registered first).
    closeBundle() {
      try {
        const src = fs.readFileSync(routeTreePath, 'utf8')
        const next = src.replace(/from '(\.\/[^']+)\.(?:ts|tsx|mts|mjs)'/g, "from '$1'")
        if (next !== src) fs.writeFileSync(routeTreePath, next, 'utf8')
      } catch {
        /* route tree not written yet */
      }
    },
  }
}

const config = defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    stripRouteTreeGenImportExtensions(),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  preview: {
    allowedHosts: process.env.ALLOWED_HOSTS ? process.env.ALLOWED_HOSTS.split(',') : undefined,
  },
})

export default config
