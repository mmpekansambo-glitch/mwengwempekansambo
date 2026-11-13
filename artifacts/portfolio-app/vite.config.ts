import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import interestTiles from './src/data/interests.json';

const appDirectory = path.resolve(import.meta.dirname);
const postsDirectory = path.join(appDirectory, 'posts');
const outputDirectory = path.join(appDirectory, 'dist/public');
const canonicalOrigin = 'https://mwengwempekansambo.com';
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;
const basePath = process.env.BASE_PATH || '/';

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

type BuiltPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  coverImage?: string;
  tags: string[];
  interests: string[];
  html: string;
  readingTime: string;
  draft: boolean;
};

async function readBlogPosts(includeDrafts: boolean): Promise<BuiltPost[]> {
  let files: string[];
  try {
    files = await readdir(postsDirectory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }

  const posts: BuiltPost[] = [];
  for (const file of files.filter((name) => name.endsWith('.md')).sort()) {
    const slug = file.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Blog filename "${file}" must use a lowercase URL slug.`);
    }

    const source = await readFile(path.join(postsDirectory, file), 'utf8');
    const frontmatter = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(source);
    if (!frontmatter) {
      throw new Error(`Post "${file}" needs YAML front matter.`);
    }
    const parsedData: unknown = parseYaml(frontmatter[1]);
    if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
      throw new Error(`Post "${file}" front matter must be a YAML object.`);
    }
    const data = parsedData as Record<string, unknown>;
    const content = source.slice(frontmatter[0].length);
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const summary = typeof data.summary === 'string' ? data.summary.trim() : '';
    const dateValue = data.date;
    const date = dateValue instanceof Date
      ? dateValue.toISOString().slice(0, 10)
      : String(dateValue ?? '');
    if (!title || !summary || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Post "${file}" needs a title, ISO date, and summary in front matter.`);
    }

    const draft = data.draft === true;
    if (draft && !includeDrafts) continue;

    const tags = Array.isArray(data.tags)
      ? data.tags.filter((tag: unknown): tag is string => typeof tag === 'string')
      : typeof data.tags === 'string'
        ? [data.tags]
        : [];
    const coverValue = data.coverImage ?? data.cover;
    const coverImage = typeof coverValue === 'string' ? coverValue : undefined;
    if (data.interests !== undefined && !Array.isArray(data.interests) && typeof data.interests !== 'string') {
      throw new Error(`Post "${file}" interests must be a list of interest ids.`);
    }
    const interestIds: unknown[] = Array.isArray(data.interests)
      ? data.interests
      : typeof data.interests === 'string'
        ? [data.interests]
        : [];
    if (interestIds.some((id) => typeof id !== 'string' || !interestTiles.some((tile) => tile.id === id))) {
      throw new Error(`Post "${file}" has an unknown interest id in front matter.`);
    }
    const words = content.match(/[\p{L}\p{N}’'-]+/gu)?.length ?? 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    posts.push({
      slug,
      title,
      date,
      summary,
      ...(coverImage ? { coverImage } : {}),
      tags,
      interests: interestIds as string[],
      html: await marked.parse(content),
      readingTime: `${minutes} min read`,
      draft,
    });
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

const escapeAttribute = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function replaceMetaContent(html: string, attribute: 'name' | 'property', name: string, value: string) {
  const pattern = new RegExp(`(<meta ${attribute}="${name}" content=")[^"]*(" \\/>)`);
  return html.replace(pattern, (_match, prefix: string, suffix: string) =>
    `${prefix}${escapeAttribute(value)}${suffix}`,
  );
}

function htmlForMetadata(
  indexHtml: string,
  metadata: {
    title: string;
    description: string;
    image?: string;
    canonicalPath: string;
    ogType?: 'website' | 'article';
  },
) {
  const { title, description, canonicalPath, ogType = 'website' } = metadata;
  const canonicalUrl = `${canonicalOrigin}${canonicalPath}`;
  const imageUrl = new URL(metadata.image ?? '/images/mwengwe-social-card.jpg', canonicalOrigin).href;
  let html = indexHtml.replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(title)}</title>`);
  html = replaceMetaContent(html, 'name', 'description', description);
  html = replaceMetaContent(html, 'property', 'og:title', title);
  html = replaceMetaContent(html, 'property', 'og:description', description);
  html = replaceMetaContent(html, 'property', 'og:type', ogType);
  html = replaceMetaContent(html, 'property', 'og:url', canonicalUrl);
  html = replaceMetaContent(html, 'property', 'og:image', imageUrl);
  html = replaceMetaContent(html, 'property', 'og:image:alt', `${title} image`);
  html = replaceMetaContent(html, 'name', 'twitter:title', title);
  html = replaceMetaContent(html, 'name', 'twitter:description', description);
  html = replaceMetaContent(html, 'name', 'twitter:image', imageUrl);
  html = replaceMetaContent(html, 'name', 'twitter:image:alt', `${title} image`);
  return html.replace(
    /(<link rel="canonical" href=")[^"]*(" \/>)/,
    (_match, prefix: string, suffix: string) => `${prefix}${escapeAttribute(canonicalUrl)}${suffix}`,
  );
}

function htmlForPost(indexHtml: string, post: BuiltPost) {
  return htmlForMetadata(indexHtml, {
    title: `${post.title} — Mwengwe Mpekansambo`,
    description: post.summary,
    image: post.coverImage,
    canonicalPath: `/blog/${post.slug}`,
    ogType: 'article',
  });
}

function blogPostsPlugin(): Plugin {
  const publicId = 'virtual:blog-posts';
  const resolvedId = `\0${publicId}`;
  let includeDrafts = true;

  return {
    name: 'portfolio-blog-posts',
    configureServer(server) {
      server.watcher.add(postsDirectory);
      const reloadPosts = (filePath: string) => {
        if (!filePath.startsWith(postsDirectory) || !filePath.endsWith('.md')) return;
        const virtualModule = server.moduleGraph.getModuleById(resolvedId);
        if (virtualModule) server.moduleGraph.invalidateModule(virtualModule);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reloadPosts);
      server.watcher.on('change', reloadPosts);
      server.watcher.on('unlink', reloadPosts);
    },
    configResolved(config) {
      includeDrafts = !(config.command === 'build' && config.isProduction);
    },
    resolveId(id) {
      if (id === publicId) return resolvedId;
    },
    async load(id) {
      if (id === resolvedId) {
        return `export default ${JSON.stringify(await readBlogPosts(includeDrafts))};`;
      }
    },
  };
}

function resumeAvailabilityPlugin(): Plugin {
  const publicId = 'virtual:resume-available';
  const resolvedId = `\0${publicId}`;
  const resumePath = path.join(appDirectory, 'public/resume.pdf');

  return {
    name: 'portfolio-resume-availability',
    resolveId(id) {
      if (id === publicId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) return `export default ${existsSync(resumePath)};`;
    },
    configureServer(server) {
      server.watcher.add(path.dirname(resumePath));
      const reloadAvailability = (filePath: string) => {
        if (path.resolve(filePath) !== resumePath) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reloadAvailability);
      server.watcher.on('unlink', reloadAvailability);
    },
  };
}

function staticRoutePages(): Plugin {
  let includeDrafts = true;
  return {
    name: 'portfolio-static-route-pages',
    apply: 'build',
    configResolved(config) {
      includeDrafts = !(config.command === 'build' && config.isProduction);
    },
    async closeBundle() {
      const indexHtmlPath = path.join(outputDirectory, 'index.html');
      const indexHtml = await readFile(indexHtmlPath, 'utf8');
      for (const route of ['about', 'experience', 'interests', 'blog', 'contact']) {
        const routeDirectory = path.join(outputDirectory, route);
        await mkdir(routeDirectory, { recursive: true });
        await copyFile(indexHtmlPath, path.join(routeDirectory, 'index.html'));
      }
      for (const interest of interestTiles) {
        const description = `Explore published writing about ${interest.title}.`;
        const routeDirectory = path.join(outputDirectory, 'interests', interest.id);
        await mkdir(routeDirectory, { recursive: true });
        await writeFile(
          path.join(routeDirectory, 'index.html'),
          htmlForMetadata(indexHtml, {
            title: `${interest.title} — Interests — Mwengwe Mpekansambo`,
            description,
            image: `/images/interests/${interest.image}`,
            canonicalPath: `/interests/${interest.id}`,
          }),
        );
      }
      for (const post of await readBlogPosts(includeDrafts)) {
        const postDirectory = path.join(outputDirectory, 'blog', post.slug);
        await mkdir(postDirectory, { recursive: true });
        await writeFile(path.join(postDirectory, 'index.html'), htmlForPost(indexHtml, post));
      }
      await copyFile(indexHtmlPath, path.join(outputDirectory, '404.html'));
    },
  };
}

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react(), tailwindcss(), blogPostsPlugin(), resumeAvailabilityPlugin(), staticRoutePages()];

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
        cartographer.cartographer({ root: path.resolve(appDirectory, '..') }),
        devBanner.devBanner(),
      );
    }
  }

  return {
    base: basePath,
    plugins,
    resolve: {
      alias: {
        '@': path.join(appDirectory, 'src'),
        '@assets': path.resolve(appDirectory, '..', '..', 'attached_assets'),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: appDirectory,
    build: {
      outDir: outputDirectory,
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      fs: { strict: true },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
