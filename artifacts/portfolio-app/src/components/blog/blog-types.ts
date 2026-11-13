export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  coverImage?: string;
  tags: string[];
  html: string;
  readingTime: string;
  interests?: string[];
  draft?: boolean;
};

export function formatBlogDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
