import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';

import styles from './tiles.module.scss';

export default function Tiles({
  buttons,
  description,
  tiles,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <div className={styles.container}>
      <SectionIntro
        description={description}
        fitInline
        title={title}
        titleTag={titleTag}
        titleTagStyle={titleTagStyle}
      >
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <TileCarousel itemTemplate={Tile} items={tiles} name="Tiles" />
    </div>
  );
}
