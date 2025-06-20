
// This file is kept for backward compatibility
// In the new structure, we're exporting directly from blogData.ts
import type { BlogPost } from './types';
import { posts } from './posts/index';

export const blogData: BlogPost[] = posts;
