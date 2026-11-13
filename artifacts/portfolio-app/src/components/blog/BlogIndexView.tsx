import type { BlogPost } from './blog-types';
import './blog.css';
import { BlogPostCards } from './BlogPostCards';

type BlogIndexViewProps = {
  posts: BlogPost[];
};

export function BlogIndexView({ posts }: BlogIndexViewProps) {
  return (
    <main className="page-content blog-index" id="page-content">
      <section className="page-intro" aria-labelledby="blog-index-title">
        <h1 className="content-heading" id="blog-index-title">Blog</h1>
        <p>Ideas, observations, and stories.</p>
      </section>

      {posts.length > 0 ? (
        <BlogPostCards posts={posts} />
      ) : (
        <section className="blog-empty" aria-live="polite">
          <p>First post coming soon.</p>
        </section>
      )}
    </main>
  );
}

export type { BlogIndexViewProps };
