import { ArrowLeft } from 'lucide-react';
import { formatBlogDate, type BlogPost } from './blog-types';
import './blog.css';
import { Link } from 'wouter';

type BlogArticleViewProps = {
  post: BlogPost;
  interestTiles: Array<{ id: string; title: string }>;
};

export function BlogArticleView({ post, interestTiles }: BlogArticleViewProps) {
  const postInterests = (post.interests ?? [])
    .map((id) => interestTiles.find((interest) => interest.id === id))
    .filter((interest): interest is { id: string; title: string } => Boolean(interest));

  return (
    <main className="page-content blog-article" id="page-content">
      <Link
        href="/blog"
        className="blog-back"
        data-testid="link-blog-back"
      >
        <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
        <span>Back to Blog</span>
      </Link>

      <article aria-labelledby="blog-article-title">
        <header className="blog-article-header">
          <h1 className="content-heading" id="blog-article-title">{post.title}</h1>
          <p className="blog-article-summary">{post.summary}</p>
          <div className="blog-article-meta">
            <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
            <span aria-hidden="true" className="blog-meta-separator">·</span>
            <span>{post.readingTime}</span>
          </div>
          {post.tags.length > 0 && (
            <ul className="blog-tags blog-article-tags" aria-label="Tags">
              {post.tags.map((tag) => <li className="blog-tag" key={tag}>{tag}</li>)}
            </ul>
          )}
          {postInterests.length > 0 && (
            <div className="blog-related-interests">
              <ul className="blog-tags blog-article-tags" aria-label="Related interests">
                {postInterests.map((interest) => (
                  <li key={interest.id}>
                    <Link className="blog-tag blog-interest-link" href={`/interests/${interest.id}`}>
                      {interest.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        {post.coverImage && (
          <figure className="blog-article-cover">
            <img src={post.coverImage} alt="" />
          </figure>
        )}

        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  );
}

export type { BlogArticleViewProps };
