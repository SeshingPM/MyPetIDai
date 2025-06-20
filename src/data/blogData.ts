
// Direct export of blog data and types
import { posts } from './blog/posts/index';
import type { BlogPost } from './blog/types';

// Export blog data as a concrete array
export const blogData: BlogPost[] = posts;
export type { BlogPost };
