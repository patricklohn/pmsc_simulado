import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const ALIASES = [
  'components',
  'configs',
  'database',
  'contexts',
  'forms',
  'hooks',
  'screens',
  'server',
  'services',
  'shell',
  'styles',
  'tests',
  'types',
  'utils',
] as const;

/** Mesmos aliases do `tsconfig.json` (`@components/*` → `src/components/*`). */
const alias = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
  ...Object.fromEntries(ALIASES.map((name) => [`@${name}`, fileURLToPath(new URL(`./src/${name}`, import.meta.url))])),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    css: false,
  },
});
