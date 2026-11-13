import { Link } from 'wouter';
import { formatBlogDate, type BlogPost } from './blog-types';

export function BlogPostCards({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="blog-grid" aria-label="Posts">
      {posts.map((post) => (
        <Link
          href={`/blog/${post.slug}`}
          className="blog-card"
          key={post.slug}
          aria-label={`Read ${post.title}`}
          data-testid={`link-blog-post-${post.slug}`}
        >
          {post.coverImage && (
            <span className="blog-card-media">
              <img src={post.coverImage} alt="" loading="lazy" />
            </span>
          )}
          <span className="blog-card-content">
            <span className="blog-card-meta">
              <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              <span aria-hidden="true" className="blog-meta-separator">·</span>
              <span>{post.readingTime}</span>
            </span>
            <span className="blog-card-title">{post.title}</span>
            <span className="blog-card-summary">{post.summary}</span>
            {post.tags.length > 0 && (
              <span className="blog-tags" aria-label="Tags">
                {post.tags.map((tag) => <span className="blog-tag" key={tag}>{tag}</span>)}
              </span>
            )}
          </span>
        </Link>
      ))}
    </section>
  );
}
