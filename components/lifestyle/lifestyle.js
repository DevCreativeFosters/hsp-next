'use client';

import routes from '@lib/routes';

import Container from '@components/container/container';
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
  titleTag,
  titleTagStyle,
}) {
  const featuredNormalized = featured && {
    className: 'featured',
    content: featured.excerpt,
    createdAt: featured.date,
    image: featured.featuredImage?.node,
    title: featured.title,
    url: featured.uri,
  };

  const postsNormalized = posts.map(
    ({ date, excerpt, featuredImage, hspTvPostId, link, ...props }) => {
      const slug = link
        .split('/')
        .filter(slug => slug)
        .pop();

      return {
        content: excerpt,
        createdAt: date,
        image: featuredImage?.node,
        url: hspTvPostId ? routes.tv(slug) : routes.blog(slug),
        ...props,
      };
    },
  );

  const carouselItems = [featuredNormalized, ...postsNormalized].filter(
    Boolean,
  );

  return (
    <Container flexibleBlockPadding>
      <SectionIntro
        description={description}
        noTopMargin
        title={title}
        titleTag={titleTag}
        titleTagStyle={titleTagStyle}
      >
        <SectionButtons addMobileMarginTop alwaysInRow buttons={buttons} />
      </SectionIntro>

      {featured && (
        <FeaturedArticle
          content={featured.excerpt}
          createdAt={featured.date}
          image={featured.featuredImage?.node}
          title={featured.title}
          url={featured.uri}
        />
      )}

      {carouselItems.length > 0 && (
        <TileCarousel
          itemTemplate={Tile}
          items={carouselItems}
          name="Lifestyle -> posts"
        />
      )}
    </Container>
  );
}
