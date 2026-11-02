import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';

/**
 * Which TV brand to build for: a folder name in platforms/, passed as the Vite
 * mode (`vite build --mode lg`). Plain `vite` / `vitest` default to lg.
 * `@platform` resolves to that folder's index.ts, and its public/ folder
 * (app manifest, icons) is copied into dist/<platform>/.
 */
function platformFor(mode: string): { name: string; dir: string } {
  const name = mode === 'development' || mode === 'production' || mode === 'test' ? 'lg' : mode;
  const dir = fileURLToPath(new URL(`./platforms/${name}/`, import.meta.url));
  if (!existsSync(`${dir}index.ts`)) {
    throw new Error(`Unknown platform "${name}": platforms/${name}/index.ts does not exist.`);
  }
  return { name, dir };
}

/**
 * TV runtimes load packaged apps from file://, where Chromium blocks
 * `<script type="module" crossorigin>`. We build a single classic IIFE bundle
 * and rewrite the generated tags so the package runs on older TV browsers.
 */
function classicScriptTags(): Plugin {
  return {
    name: 'tv-classic-script-tags',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin/g, '<script defer')
        .replace(/ crossorigin/g, '');
    },
  };
}

export default defineConfig(({ mode }) => {
  const platform = platformFor(mode);
  return {
    base: './',
    plugins: [classicScriptTags()],
    resolve: {
      alias: { '@platform': `${platform.dir}index.ts` },
    },
    publicDir: `${platform.dir}public`,
    build: {
      outDir: `dist/${platform.name}`,
      emptyOutDir: true,
      target: 'es2015',
      modulePreload: { polyfill: false },
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          format: 'iife',
          inlineDynamicImports: true,
          entryFileNames: 'assets/app.js',
        },
      },
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts', 'platforms/**/*.test.ts'],
    },
  };
});
