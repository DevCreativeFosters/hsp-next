import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import VideoTile from '@components/video-tile/video-tile';

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
        name="Video carousel a.k.a Celebrities"
      />
    </Container>
  );
}
