
export interface BlogAuthor {
  name: string;
  avatar: string;
  role: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  featured?: boolean;
  metaDescription?: string;
  tableOfContents?: { title: string; id: string }[];
  relatedPosts?: string[]; // IDs of related posts
  lastModified?: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface BlogTag {
  name: string;
  slug: string;
  postCount?: number;
}
