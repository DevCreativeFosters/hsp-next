import Container from '@components/container/container';
import Button from '@components/button/button';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import VideoTile from '@components/video-tile/video-tile';
import styles from './video-carousel.module.scss';

export default function VideoCarousel({ videos, title, description, button }) {
  return (
    <Container>
      <SectionIntro title={title} description={description} fitInline>
        <Button className={styles.button} href={button?.url}>
          {button?.title}
        </Button>
      </SectionIntro>

      <TileCarousel items={videos} itemTemplate={VideoTile} variant="videos" />
    </Container>
  );
}
