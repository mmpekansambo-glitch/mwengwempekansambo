# Portfolio app

## Static build

From the repository root, install dependencies and build:

```sh
pnpm install
pnpm --filter @workspace/portfolio-app run build
```

Deploy the contents of `artifacts/portfolio-app/dist/public/`. The build includes the app assets, route entry files, and a `404.html` fallback for static hosting.

## Add a blog post

Create a Markdown file in `artifacts/portfolio-app/posts/` with `title`, `date`, and `summary` front matter. `coverImage`, `tags`, `interests`, and `draft` are optional. Add one or more existing interest ids—`financial-stem`, `zambia-agriculture`, `stories`, `photography-plants`, or `textile-crafts`—to `interests` to show the post on those Interests pages. A post can be linked to multiple interests. Set `draft: true` while writing; draft posts are excluded from production builds. See `posts/how-to-write-a-post.md` for the draft template.
