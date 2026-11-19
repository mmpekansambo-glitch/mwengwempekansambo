import { copyFile, mkdir } from 'node:fs/promises';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin, type PluginOption } from 'vite';

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

function staticRoutePages(): Plugin {
  return {
    name: 'portfolio-static-route-pages',
    apply: 'build',
    async closeBundle() {
      const outputDirectory = path.resolve(import.meta.dirname, 'dist/public');
      const indexHtml = path.join(outputDirectory, 'index.html');
      await Promise.all(
        ['about', 'experience', 'interests', 'contact'].map(async (route) => {
          const routeDirectory = path.join(outputDirectory, route);
          await mkdir(routeDirectory, { recursive: true });
          await copyFile(indexHtml, path.join(routeDirectory, 'index.html'));
        }),
      );
      await copyFile(indexHtml, path.join(outputDirectory, '404.html'));
    },
  };
}

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react(), tailwindcss(), staticRoutePages()];

  if (process.env.REPL_ID) {
    const { default: runtimeErrorOverlay } = await import(
      '@replit/vite-plugin-runtime-error-modal'
    );
    plugins.push(runtimeErrorOverlay());

    if (process.env.NODE_ENV !== 'production') {
      const [cartographer, devBanner] = await Promise.all([
        import('@replit/vite-plugin-cartographer'),
        import('@replit/vite-plugin-dev-banner'),
      ]);
      plugins.push(
        cartographer.cartographer({
          root: path.resolve(import.meta.dirname, '..'),
        }),
        devBanner.devBanner(),
      );
    }
  }

  return {
    base: basePath,
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
