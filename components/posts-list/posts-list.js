'use client';

import Tile from '@components/tile/tile';
import styles from './posts-list.module.scss';
import { usePaginationContext } from '@contexts/pagination';
import { useEffect, useState } from 'react';

export default function PostsList({
  posts,
  variant,
  perPage,
  paginationScope,
}) {
  const [postsDisplayed, setPostsDisplayed] = useState(posts);
  const [loading, setLoading] = useState(true);
  const context = usePaginationContext(paginationScope);
  const currentPage = context.value[paginationScope];

  useEffect(
    function fetchPostsPerPage() {
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const postsToDisplay = posts?.slice(startIndex, endIndex);
      setPostsDisplayed(postsToDisplay);
      setLoading(false);
    },
    [currentPage, perPage, posts],
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
      {postsDisplayed?.map((post, idx) => {
        const tags = post?.tags?.nodes?.map(tag => tag.name) || [];

        return (
          <Tile
            key={post.title + idx}
            title={post.title}
            content={post.excerpt}
            createdAt={post.date}
            url={post.uri}
            tags={tags}
            image={post.featuredImage?.node}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
