# Portfolio app

## Build for static hosting

From the repository root, install the workspace dependencies and build the portfolio:

```sh
pnpm install
pnpm --filter @workspace/portfolio-app run build
```

The static site is written to `artifacts/portfolio-app/dist/public/`. It includes the built HTML, JavaScript, CSS, images, route entry pages for `/about`, `/experience`, `/interests`, and `/contact`, plus a `404.html` SPA fallback. Deploy the contents of that directory to a static host. Hosts that require an explicit SPA rewrite should route unknown paths to `/index.html`.

To run the development server locally, use:

```sh
pnpm --filter @workspace/portfolio-app run dev
```

Outside Replit, the development server defaults to port `5173` and the build base path defaults to `/`. Set `PORT` or `BASE_PATH` only when a different value is needed.
