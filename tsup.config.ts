import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['packages/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
})
