import Link from 'next/link';
import Button from '@components/button/button';
import styles from './related-posts.module.scss';

export default function RelatedPosts({ type = 'hsp_tv', posts, url }) {
  const title = type === 'blog' ? 'HSP Blog' : type === 'hsp-tv' && 'HSP TV';
  const parentSlug =
    type === 'blog' ? '/hsp-blog' : type === 'hsp-tv' && '/hsp-tv';

  return (
    <div className={styles.relatedPosts}>
      {title && (
        <Button
          size="small"
          variant="tertiary"
          className={styles.button}
          rightIcon="arrow-forward"
          href={url}
        >
          {title}
        </Button>
      )}
      <ul className={styles.list}>
        {posts.map(post => (
          <li key={post?.uri}>
            <Link className={styles.link} href={`${parentSlug}/${post?.uri}`}>
              {post?.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
