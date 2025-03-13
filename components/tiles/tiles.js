import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';

export default function Tiles({
  buttons,
  description,
  tiles,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <Container flexibleBlockPadding>
      <SectionIntro
        description={description}
        fitInline
        title={title}
        titleTag={titleTag}
        titleTagStyle={titleTagStyle}
      >
        <SectionButtons alwaysInRow buttons={buttons} />
      </SectionIntro>

      <TileCarousel itemTemplate={Tile} items={tiles} name="Tiles" />
    </Container>
  );
}
