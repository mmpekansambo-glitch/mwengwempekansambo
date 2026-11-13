declare module 'virtual:blog-posts' {
  import type { BlogPost } from './components/blog/blog-types';

  const posts: BlogPost[];
  export default posts;
}
