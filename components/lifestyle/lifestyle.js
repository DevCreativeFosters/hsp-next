'use client';

import SectionIntro from '@components/section-intro/section-intro';
import SectionButtons from '@components/section-buttons/section-buttons';
import FeaturedArticle from './featured-article';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';
import styles from './lifestyle.module.scss';
import routes from '@lib/routes';

export default function Lifestyle({
  title,
  description,
  buttons,
  featured,
  posts,
}) {
  const postsNormalized = posts.map(
    ({ date, excerpt, tags, featuredImage, link, ...props }) => {
      const slug = link
        .split('/')
        .filter(slug => slug)
        .pop();

      return {
        createdAt: date,
        tags: tags?.nodes || [],
        image: featuredImage?.node,
        content: excerpt,
        url: routes.tv(slug),
        ...props,
      };
    },
  );

  return (
    <div className={styles.container}>
      <SectionIntro title={title} description={description}>
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <FeaturedArticle
        title={featured.title}
        content={featured.excerpt}
        createdAt={featured.date}
        url={featured.uri}
        tags={featured.tags.nodes}
        image={featured.featuredImage?.node}
      />
      {posts.length > 0 && (
        <TileCarousel items={postsNormalized} itemTemplate={Tile} />
      )}
    </div>
  );
}
