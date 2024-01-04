import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import VideoTile from '@components/video-tile/video-tile';
import routes from '@lib/routes';
import styles from './video-carousel.module.scss';

export default function VideoCarousel({
  title,
  description,
  videos,
  buttons,
  context,
}) {
  return (
    <Container collapseMargin>
      <SectionIntro
        title={title}
        description={description}
        fitInline
        narrowDescription
      >
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <TileCarousel
        items={videos}
        itemTemplate={VideoTile}
        itemTemplateType="celebrities"
        context={context}
      />
    </Container>
  );
}
