import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';
import extractWordBetween from '@lib/extract-word-between';

import Background from '@components/background/background';
import DownloadLinkWrapper from '@components/download-link-wrapper/download-link-wrapper';

import AccordionFactsBlock from './blocks/accordion-facts';
import AccreditationsBlock from './blocks/accreditations';
import CategoriesAndProductsBlock from './blocks/categories-and-products';
import ChooseYourVehicleFlexibleBlock from './blocks/choose-your-vehicle';
import ColumnsFactsBlock from './blocks/columns-facts';
import FAQBlock from './blocks/faq';
import FeaturePanelsBlock from './blocks/feature-panels';
import FeaturesValuesBlock from './blocks/features-values';
import HeroBlock from './blocks/hero';
import HeroProductRowBlock from './blocks/hero-product-row';
import ImageTextBoxesBlock from './blocks/image-text-boxes';
import InformationCardsBlock from './blocks/information-cards';
import InstagramFeedBlock from './blocks/instagram-feed';
import IntroAndCardsBlock from './blocks/intro-and-cards';
import LifestyleBlock from './blocks/lifestyle';
import LinksInGroupsBlock from './blocks/links-in-groups';
import PostsCarouselBlock from './blocks/posts-carousel';
import ProductAddonsBlock from './blocks/product-addons';
import ProductGridBlock from './blocks/product-grid';
import PromoImageAndTextBlock from './blocks/promo-image-and-text';
import PromoWithTwoVideosBlock from './blocks/promo-with-two-videos';
import ReviewsBlock from './blocks/reviews';
import ShortcodeBlock from './blocks/shortcode';
import SidebarLinkGroupBlock from './blocks/sidebar-link-group';
import TextAndVideoPromoBlock from './blocks/text-and-video-promo';
import TilesBlock from './blocks/tiles';
import TitleAndDescriptionBlock from './blocks/title-and-description';
import VideoBackgroundHeroBlock from './blocks/video-background-hero';
import VideoCarouselBlock from './blocks/video-carousel';
import VideoEmbedBlock from './blocks/video-embed';

const getBlockName = block =>
  extractWordBetween(block?.fieldGroupName, blockPrefix, blockSuffix);

async function render(
  block,
  makes,
  variants,
  params,
  mainCategoryContentBlocks,
) {
  const blockName = getBlockName(block);

  switch (blockName) {
    case 'AccordionFacts':
      return AccordionFactsBlock(block);

    case 'Accreditations':
      return AccreditationsBlock(block);

    case 'CategoriesAndProducts':
      return CategoriesAndProductsBlock(block);

    case 'ColumnsFacts':
      return ColumnsFactsBlock(block);

    case 'Faq':
      return FAQBlock(block);

    case 'FeaturePanels':
      return FeaturePanelsBlock(block);

    case 'FeaturesValues':
      return FeaturesValuesBlock(block);

    case 'Hero':
      return HeroBlock(block);

    case 'ImageTextBoxes':
      return ImageTextBoxesBlock(block);

    case 'InformationCards':
      return InformationCardsBlock(block);

    case 'InstagramFeed':
      return InstagramFeedBlock(block);

    case 'IntroAndCards':
      return IntroAndCardsBlock(block);

    case 'Lifestyle':
      return LifestyleBlock(block);

    case 'LinksInGroups':
      return LinksInGroupsBlock(block);

    case 'PostsCarousel':
      return await PostsCarouselBlock(block);

    case 'ProductAddons':
      return ProductAddonsBlock(block);

    case 'ProductGrid':
      return ProductGridBlock(block);

    case 'ProductTiles':
      return HeroProductRowBlock(block);

    case 'PromoImageAndText':
      return PromoImageAndTextBlock(block);

    case 'PromoTextAndVideo':
      return TextAndVideoPromoBlock(block);

    case 'PromoWith2Videos':
      return PromoWithTwoVideosBlock(block);

    case 'Reviews':
      return ReviewsBlock(block, mainCategoryContentBlocks);

    case 'Shortcode':
      return ShortcodeBlock(block?.shortcode);

    case 'SidebarLinkGroup':
      return SidebarLinkGroupBlock(block);

    case 'Tiles':
      return TilesBlock(block);

    case 'TitleAndDescription':
      return TitleAndDescriptionBlock(block);

    case 'VideoBackgroundHero':
      return VideoBackgroundHeroBlock(block);

    case 'VideoCarousel':
      return VideoCarouselBlock(block);

    case 'VideoEmbed':
      return VideoEmbedBlock(block);

    case 'ChooseYourVehicle':
      return ChooseYourVehicleFlexibleBlock(makes, variants, params);

    default:
      break;
  }
}

export async function renderBlock(
  block,
  makes,
  variants,
  params,
  mainCategoryBlocks = null,
) {
  const background = block?.background;
  const content = await render(
    block,
    makes,
    variants,
    params,
    mainCategoryBlocks,
  );

  const blockName = getBlockName(block);

  return (
    <DownloadLinkWrapper blockName={blockName}>
      {background ? (
        <Background colorStops={background}>{content}</Background>
      ) : (
        content
      )}
    </DownloadLinkWrapper>
  );
}
