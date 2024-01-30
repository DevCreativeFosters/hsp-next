'use client';

import Container from '@components/container/container';
import Button from '@components/button/button';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import Tile from '@components/tile/tile';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import { useIsMobile } from '@hooks/useIsMobile';
import styles from './posts-masonry.module.scss';

export default function PostsMasonry({ title, description, button, posts }) {
  const isMobile = useIsMobile();

  return (
    <Container collapseMargin>
      <SectionIntro title={title} description={description} fitInline>
        {button && !isMobile && (
          <SectionButtons>
            <Button href={button.url} variant="primary">
              {button.title}
            </Button>
          </SectionButtons>
        )}
      </SectionIntro>

      {isMobile ? (
        <div className={styles.carousel}>
          <TileCarousel
            items={posts}
            itemTemplate={Tile}
            name="posts masonry"
          />
        </div>
      ) : (
        <div className={styles.masonry} data-items={posts.length}>
          {posts?.map((post, index) => (
            <Tile key={post.title + index} {...post} />
          ))}
        </div>
      )}
    </Container>
  );
}
