'use client';

import { useEffect, useState } from 'react';
import Tile from '@components/tile/tile';
import styles from './posts-list.module.scss';

export default function PostsList({ posts, variant, currentPage }) {
  useEffect(
    function scrollToTopWhenPaginationChanges() {
      window.scrollTo(0, 0);
    },
    [currentPage],
  );

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
            image={post.featuredImage?.node}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
