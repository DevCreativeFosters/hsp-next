import Link from 'next/link';

import routes from '@lib/routes';

import Button from '@components/button/button';

import styles from './related-posts.module.scss';

export default function RelatedPosts({ posts, type = 'hsp-tv', url }) {
  const title = type === 'blog' ? 'HSP Blog' : type === 'hsp-tv' && 'HSP TV';

  return (
    <div className={styles.relatedPosts}>
      {title && (
        <Button
          className={styles.button}
          href={url}
          rightIcon="arrow-forward"
          size="small"
          variant="tertiary"
        >
          {title}
        </Button>
      )}
      <ul className={styles.list}>
        {posts.map(post => {
          return (
            <li key={post.id}>
              <Link
                className={styles.link}
                href={
                  type === 'blog'
                    ? routes.blog(post.slug)
                    : type === 'hsp-tv'
                      ? routes.tv(post.slug)
                      : '#'
                }
              >
                {post?.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
