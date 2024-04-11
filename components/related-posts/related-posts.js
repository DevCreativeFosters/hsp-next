import Link from 'next/link';

import routes from '@lib/routes';

import Button from '@components/button/button';

import styles from './related-posts.module.scss';

export default function RelatedPosts({ posts, type = 'hsp_tv', url }) {
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
          const parts = post.uri.split('/');
          const slug = parts[parts.length - 2];
          return (
            <li key={slug}>
              <Link
                className={styles.link}
                href={
                  type === 'blog'
                    ? routes.blog(slug)
                    : type === 'hsp-tv'
                      ? routes.tv(slug)
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
