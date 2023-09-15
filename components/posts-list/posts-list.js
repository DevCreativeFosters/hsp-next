'use client';

import Tile from '@components/tile/tile';
import styles from './posts-list.module.scss';
import { getAllBlogPosts } from '@lib/api';
import { usePaginationContext } from '@contexts/pagination';
import { useEffect, useState } from 'react';

export default function PostsList({
  initialPosts,
  variant,
  perPage,
  paginationScope,
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(true);
  const context = usePaginationContext(paginationScope);
  const currentPage = context.value[paginationScope];

  useEffect(
    function fetchPostsPerPage() {
      setLoading(true);
      async function fetchData() {
        try {
          const data = await getAllBlogPosts(currentPage, perPage);
          setPosts(data?.posts?.nodes);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
      fetchData();
    },
    [currentPage, perPage],
  );

  useEffect(
    function scrollToTopWhenPaginationChanges() {
      window.scrollTo(0, 0);
    },
    [currentPage],
  );

  if (loading) {
    return 'Loading...'; //WIP - add loading indicator
  }

  return (
    <div className={styles.posts}>
      {posts?.map((post, idx) => {
        const tags = post?.tags?.nodes?.map(tag => tag.name) || [];

        return (
          <Tile
            key={post.title + idx}
            title={post.title}
            content={post.excerpt}
            createdAt={post.date}
            url={post.uri}
            tags={tags}
            image={post.featuredImage.node}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
