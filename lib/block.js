import {
  getLatestNumberOfBlogPosts,
  getLatestNumberOfHSPTVPosts,
} from '@lib/api';
import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';
import Accreditations from '@components/accreditations/accreditations';
import Background from '@components/background/background';
import CategoriesAndProducts from '@components/categories-and-products/categories-and-products';
import Container from '@components/container/container';
import FAQ from '@components/faq/faq';
import Features from '@components/features/features';
import HeroProductRow from '@components/hero-product-row/hero-product-row';
import Hero from '@components/hero/hero';
import InformationCards from '@components/information-cards/information-cards';
import IntroAndCards from '@components/intro-and-cards/intro-and-cards';
import Lifestyle from '@components/lifestyle/lifestyle';
import LinksInGroups from '@components/links-in-groups/links-in-groups';
import PromoImageText from '@components/promo-image-text/promo-image-text';
import PromoWithTwoVideos from '@components/promos-with-two-videos/promos-with-two-videos';
import Reviews from '@components/reviews/reviews';
import TextAndImagePromo from '@components/text-and-image-promo/text-and-image-promo';
import Tiles from '@components/tiles/tiles';
import TitleAndDescription from '@components/title-and-description/title-and-description';
import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';
import PostsCarousel from '@components/posts-carousel/posts-carousel';
import PostsMasonry from '@components/posts-masonry/posts-masonry';

export async function render(block) {
  const blockName = block?.fieldGroupName?.slice(BLOCK_PREFIX.length);

  if ('Accreditations' === blockName) {
    return (
      <Accreditations
        title={block.title}
        description={block.text}
        certificates={block.certificates}
        group={block.membershipsGroup}
      />
    );
  }

  if ('CategoriesAndProducts' === blockName) {
    return <CategoriesAndProducts data={block.links} />;
  }

  if ('Faq' === blockName) {
    return (
      <Container>
        <FAQ
          title={block.title}
          description={block.description}
          buttons={block.buttons}
          questions={block.questions || []}
        />
      </Container>
    );
  }

  if ('FeaturesValues' === blockName) {
    return (
      <Container>
        <Features
          title={block.sectionTitle}
          description={block.description}
          cta={{
            label: block.buttonLink.title,
            url: block.buttonLink.url,
          }}
          video={{
            src: block.videoUrl,
            title: block.sectionTitle,
            poster: block.videoThumbnailImage.sourceUrl,
          }}
          features={block.attributes}
        />
      </Container>
    );
  }

  if ('Hero' === blockName) {
    return <Hero slides={block.heroSlides} />;
  }

  if ('ProductTiles' === blockName) {
    return (
      <HeroProductRow
        title={block.title}
        products={block.products}
        link={block.allProductsLink}
      />
    );
  }

  if ('Lifestyle' === blockName) {
    return (
      <Container>
        <Lifestyle
          title={block.title}
          description={block.description}
          buttons={block.buttons}
          featured={block.featuredPost}
          posts={block.posts || []}
        />
      </Container>
    );
  }

  if ('LinksInGroups' === blockName) {
    return (
      <Container>
        <LinksInGroups
          title={block.title}
          description={block.description}
          groups={block.groups || []}
        />
      </Container>
    );
  }

  if ('PromoWith2Videos' === blockName) {
    return <PromoWithTwoVideos data={block} />;
  }

  if ('Reviews' === blockName) {
    return <Reviews data={block} />;
  }

  if ('PromoTextAndVideo' === blockName) {
    return (
      <TextAndImagePromo
        title={block.title}
        description={block.description}
        videoUrl={block.videoUrl}
        linkText={block.learnMoreButton?.title}
        linkUrl={block.learnMoreButton?.url}
      />
    );
  }

  if ('InformationCards' === blockName) {
    return <InformationCards cards={block.cards} />;
  }

  if ('IntroAndCards' === blockName) {
    return (
      <IntroAndCards
        title={block.title}
        description={block.description}
        cards={block.cards}
      />
    );
  }

  if ('PromoImageAndText' === blockName) {
    return (
      <PromoImageText
        title={block.title}
        description={block.description}
        image={block.image}
      />
    );
  }

  if ('PostsCarousel' === blockName) {
    if (block.postType === 'blog') {
      const posts = await getLatestNumberOfBlogPosts(block.numberOfPosts);
      const blogPosts = posts?.posts?.nodes?.map(post => {
        return {
          image: {
            sourceUrl: post.featuredImage.node.sourceUrl,
            altText: post.featuredImage.node.altText,
            mediaDetails: [],
          },
          title: post.title,
          content: post.excerpt,
          createdAt: post.date,
          url: `/lifestyle/${block.postType}/${post.slug}`,
          tags: post.tags.nodes,
          variant: 'blog',
        };
      });

      return (
        <PostsMasonry
          title={block.title}
          description={block.description}
          button={block.viewAllButton}
          posts={blogPosts}
        />
      );
    } else if (block.postType === 'hsp-tv') {
      const posts = await getLatestNumberOfHSPTVPosts(block.numberOfPosts);
      const hspTvPosts = posts?.hspTvPosts?.nodes;

      const normalizedPosts = hspTvPosts?.map(post => {
        return {
          image: {
            sourceUrl: post.featuredImage?.node.sourceUrl,
            altText: post.featuredImage?.node.altText,
            mediaDetails: [],
          },
          title: post.title,
          content: post.excerpt,
          createdAt: post.date,
          url: `/lifestyle/${block.postType}/${post.slug}`,
          tags: post.tags?.nodes,
          variant: 'carousel',
        };
      });

      const button = {
        title: block.viewAllButton?.title,
        variant: 'primary',
        url: block.viewAllButton?.url,
      };

      return (
        <PostsCarousel
          title={block.title}
          description={block.description}
          posts={normalizedPosts}
          button={button}
        />
      );
    }
  }

  if ('Tiles' === blockName) {
    return (
      <Container>
        <Tiles
          title={block.title}
          description={block.description}
          buttons={block.buttons}
          tiles={block.tiles}
        />
      </Container>
    );
  }

  if ('TitleAndDescription' === blockName) {
    return (
      <Container collapseMargin>
        <TitleAndDescription
          title={block.title}
          description={block.description}
        />
      </Container>
    );
  }

  if ('VideoBackgroundHero' === blockName) {
    return (
      <VideoBackgroundHero
        title={block.title}
        description={block.description}
        linkLabel={block.link?.title}
        videoUrl={block.backgroundUrl}
      />
    );
  }

  if ('SidebarLinkGroup' === blockName) {
    return (
      <div></div> // Sidebar Component
    );
  }
}

export const renderBlock = async block => {
  const background = block?.background;
  const content = await render(block);
  return background ? (
    <Background colorStops={background}>{content}</Background>
  ) : (
    content
  );
};
