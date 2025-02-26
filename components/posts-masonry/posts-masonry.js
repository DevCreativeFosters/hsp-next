'use client';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';

import styles from './posts-masonry.module.scss';

export default function PostsMasonry({
  button,
  description,
  posts,
  title,
  titleTag,
  titleTagStyle,
}) {
  const isMobile = useIsMobile();

  return (
    <Container collapseMargin>
      <SectionIntro
        description={description}
        fitInline
        title={title}
        titleTag={titleTag}
        titleTagStyle={titleTagStyle}
      >
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
            itemTemplate={Tile}
            items={posts}
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
