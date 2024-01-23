'use client';

import SectionIntro from '@components/section-intro/section-intro';
import SectionButtons from '@components/section-buttons/section-buttons';
import FeaturedArticle from './featured-article';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';
import routes from '@lib/routes';

export default function Lifestyle({
  title,
  description,
  buttons,
  featured,
  posts,
}) {
  const featuredNormalized = {
    title: featured.title,
    content: featured.excerpt,
    createdAt: featured.date,
    url: featured.uri,
    image: featured.featuredImage?.node,
    className: 'featured',
  };

  const postsNormalized = posts.map(
    ({ date, excerpt, featuredImage, link, ...props }) => {
      const slug = link
        .split('/')
        .filter(slug => slug)
        .pop();

      return {
        createdAt: date,
        image: featuredImage?.node,
        content: excerpt,
        url: routes.tv(slug),
        ...props,
      };
    },
  );

  const carouselItems = [featuredNormalized, ...postsNormalized];

  return (
    <>
      <SectionIntro title={title} description={description} noTopMargin>
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <FeaturedArticle
        title={featured.title}
        content={featured.excerpt}
        createdAt={featured.date}
        url={featured.uri}
        image={featured.featuredImage?.node}
      />
      {carouselItems.length > 0 && (
        <TileCarousel items={carouselItems} itemTemplate={Tile} />
      )}
    </>
  );
}
