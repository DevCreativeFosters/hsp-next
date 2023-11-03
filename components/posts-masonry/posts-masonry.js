'use client';

import Container from '@components/container/container';
import Button from '@components/button/button';
import Tile from '@components/tile/tile';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import { useIsMobile } from '@hooks/useIsMobile';
import styles from './posts-masonry.module.scss';

export default function PostsMasonry({ title, description, button, posts }) {
  const isMobile = useIsMobile();

  return (
    <Container>
      <div className={styles.header}>
        <div className={styles.information}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {button && !isMobile && (
          <Button
            href={button.url}
            variant="primary"
            style={{ textWrap: 'nowrap' }}
          >
            {button.title}
          </Button>
        )}
      </div>
      {isMobile ? (
        <div className={styles.carousel}>
          <TileCarousel items={posts} itemTemplate={Tile} />
        </div>
      ) : (
        <div className={styles.masonry}>
          {posts?.map((post, index) => (
            <Tile key={post.title + index} {...post} />
          ))}
        </div>
      )}
    </Container>
  );
}
