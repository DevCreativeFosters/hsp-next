import SectionIntro from '@components/section-intro/section-intro';
import SectionButtons from '@components/section-buttons/section-buttons';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';
import styles from './tiles.module.scss';

export default function Tiles({ title, description, buttons, tiles }) {
  return (
    <div className={styles.container}>
      <SectionIntro title={title} description={description} fitInline>
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <TileCarousel items={tiles} itemTemplate={Tile} name="Tiles" />
    </div>
  );
}
