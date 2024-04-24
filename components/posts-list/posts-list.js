'use client';

import Tile from '@components/tile/tile';

import styles from './posts-list.module.scss';

export default function PostsList({ currentPage, posts, variant }) {
  return (
    <div className={styles.posts}>
      {posts?.map((post, idx) => {
        const tags = post?.tags?.nodes?.map(tag => tag.name) || [];

        return (
          <Tile
            content={post.excerpt}
            createdAt={post.date}
            image={post.featuredImage?.node}
            key={post.title + idx}
            tags={tags}
            title={post.title}
            url={post.uri}
            variant={variant}
          />
        );
      })}
    </div>
  );
}
