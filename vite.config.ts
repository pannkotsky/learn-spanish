import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const projectDir = path.dirname(fileURLToPath(import.meta.url))

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
  resolve: { tsconfigPaths: true },
  plugins: [
    stripRouteTreeGenImportExtensions(),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
