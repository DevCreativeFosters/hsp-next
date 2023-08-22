import SectionIntro from '@components/section-intro/section-intro';
import SectionButtons from '@components/section-buttons/section-buttons';
import FeaturedArticle from './featured-article';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';
import { lifestyle } from '@mockup/lifestyle';
import styles from './lifestyle.module.scss';

export default function Lifestyle() {
  const { title, description, featured, articles } = lifestyle;

  const buttons = [
    {
      label: 'HSP TV',
      url: '#',
      variant: 'quinary',
      rightIcon: 'arrow-forward',
    },
    {
      label: 'HSP Blog',
      url: '#',
      variant: 'quinary',
      rightIcon: 'arrow-forward',
    },
    {
      label: 'All stories',
      url: '#',
    },
  ];

  return (
    <div className={styles.container}>
      <SectionIntro title={title} description={description}>
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <FeaturedArticle
        title={featured.title}
        content={featured.content}
        createdAt={featured.createdAt}
        url={featured.url}
        tags={featured.tags}
        image={featured.image}
      />

      <TileCarousel items={articles} itemTemplate={Tile} />
    </div>
  );
}
