
import React from 'react';
import { BlogPost } from '@/data/blogData';
import BlogPostCard from './BlogPostCard';
import { motion } from 'framer-motion';

interface BlogPostGridProps {
  posts: BlogPost[];
}

const BlogPostGrid: React.FC<BlogPostGridProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <BlogPostCard post={post} />
        </motion.div>
      ))}
    </div>
  );
};

export default BlogPostGrid;
