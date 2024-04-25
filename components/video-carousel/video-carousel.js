import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import VideoTile from '@components/video-tile/video-tile';

export default function VideoCarousel({
  buttons,
  context,
  description,
  title,
  videos,
}) {
  return (
    <Container collapseMargin>
      <SectionIntro
        description={description}
        fitInline
        narrowDescription
        title={title}
      >
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <TileCarousel
        context={context}
        itemTemplate={VideoTile}
        itemTemplateType="celebrities"
        items={videos}
        name="Video carousel a.k.a Celebrities"
      />
    </Container>
  );
}
