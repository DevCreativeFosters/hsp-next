'use client';

import routes from '@lib/routes';

import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Tile from '@components/tile/tile';

import FeaturedArticle from './featured-article';

export default function Lifestyle({
  buttons,
  description,
  featured,
  posts,
  title,
}) {
  const featuredNormalized = {
    className: 'featured',
    content: featured.excerpt,
    createdAt: featured.date,
    image: featured.featuredImage?.node,
    title: featured.title,
    url: featured.uri,
  };

  const postsNormalized = posts.map(
    ({ date, excerpt, featuredImage, link, ...props }) => {
      const slug = link
        .split('/')
        .filter(slug => slug)
        .pop();

      return {
        content: excerpt,
        createdAt: date,
        image: featuredImage?.node,
        url: routes.tv(slug),
        ...props,
      };
    },
  );

  const carouselItems = [featuredNormalized, ...postsNormalized];

  return (
    <>
      <SectionIntro description={description} noTopMargin title={title}>
        <SectionButtons buttons={buttons} />
      </SectionIntro>

      <FeaturedArticle
        content={featured.excerpt}
        createdAt={featured.date}
        image={featured.featuredImage?.node}
        title={featured.title}
        url={featured.uri}
      />
      {carouselItems.length > 0 && (
        <TileCarousel
          itemTemplate={Tile}
          items={carouselItems}
          name="Lifestyle -> posts"
        />
      )}
    </>
  );
}
