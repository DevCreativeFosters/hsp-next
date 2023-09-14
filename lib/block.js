import Background from '@components/background/background';
import CategoriesAndProducts from '@components/categories-and-products/categories-and-products';
import Container from '@components/container/container';
import FAQ from '@components/faq/faq';
import Features from '@components/features/features';
import HeroProductRow from '@components/hero-product-row/hero-product-row';
import Hero from '@components/hero/hero';
import InformationCards from '@components/information-cards/information-cards';
import Lifestyle from '@components/lifestyle/lifestyle';
import LinksInGroups from '@components/links-in-groups/links-in-groups';
import PromoImageText from '@components/promo-image-text/promo-image-text';
import PromoWithTwoVideos from '@components/promos-with-two-videos/promos-with-two-videos';
import Reviews from '@components/reviews/reviews';
import TextAndImagePromo from '@components/text-and-image-promo/text-and-image-promo';
import Tiles from '@components/tiles/tiles';
import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';
import Accreditations from '@components/accreditations/accreditations';

const blockNamePrefix = 'Page_Flexiblecontent_Blocks_';

export const render = block => {
  const blockName = block?.fieldGroupName?.slice(blockNamePrefix.length);

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

  if ('PromoWith2Videos' === blockName) {
    return <PromoWithTwoVideos data={block} />;
  }

  if ('CategoriesAndProducts' === blockName) {
    return <CategoriesAndProducts data={block.links} />;
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

  if ('Reviews' === blockName) {
    return <Reviews data={block} />;
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

  if ('InformationCards' === blockName) {
    return <InformationCards cards={block.cards} />;
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

  if ('Accreditations' === blockName) {
    return (
      <Accreditations
        title={block?.title}
        description={block?.text}
        certificates={block?.certificates}
        group={block?.membershipsGroup}
      />
    );
  }
};

export const renderBlock = block => {
  const { background } = block;
  const content = render(block);
  return background ? (
    <Background colorStops={background}>{content}</Background>
  ) : (
    content
  );
};
