import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';
import Background from '@components/background/background';

import AccreditationsBlock from './blocks/accreditations';
import CategoriesAndProductsBlock from './blocks/categories-and-products';
import FAQBlock from './blocks/faq';
import FeaturesValuesBlock from './blocks/features-values';
import HeroBlock from './blocks/hero';
import HeroProductRowBlock from './blocks/hero-product-row';
import InformationCardsBlock from './blocks/information-cards';
import IntroAndCardsBlock from './blocks/intro-and-cards';
import LifestyleBlock from './blocks/lifestyle';
import LinksInGroupsBlock from './blocks/links-in-groups';
import PostsCarouselBlock from './blocks/posts-carousel';
import PromoImageAndTextBlock from './blocks/promo-image-and-text';
import PromoWithTwoVideosBlock from './blocks/promo-with-two-videos';
import ReviewsBlock from './blocks/reviews';
import SidebarLinkGroupBlock from './blocks/sidebar-link-group';
import TextAndVideoPromoBlock from './blocks/text-and-video-promo';
import TilesBlock from './blocks/tiles';
import TitleAndDescriptionBlock from './blocks/title-and-description';
import VideoBackgroundHeroBlock from './blocks/video-background-hero';

function render(block) {
  const blockName = block?.fieldGroupName?.slice(BLOCK_PREFIX.length);

  switch (blockName) {
    case 'Accreditations':
      return AccreditationsBlock(block);

    case 'CategoriesAndProducts':
      return CategoriesAndProductsBlock(block);

    case 'Faq':
      return FAQBlock(block);

    case 'FeaturesValues':
      return FeaturesValuesBlock(block);

    case 'Hero':
      return HeroBlock(block);

    case 'InformationCards':
      return InformationCardsBlock(block);

    case 'IntroAndCards':
      return IntroAndCardsBlock(block);

    case 'Lifestyle':
      return LifestyleBlock(block);

    case 'LinksInGroups':
      return LinksInGroupsBlock(block);

    case 'PostsCarousel':
      return PostsCarouselBlock(block);

    case 'ProductTiles':
      return HeroProductRowBlock(block);

    case 'PromoImageAndText':
      return PromoImageAndTextBlock(block);

    case 'PromoTextAndVideo':
      return TextAndVideoPromoBlock(block);

    case 'PromoWith2Videos':
      return PromoWithTwoVideosBlock(block);

    case 'Reviews':
      return ReviewsBlock(block);

    case 'SidebarLinkGroup':
      return SidebarLinkGroupBlock(block);

    case 'Tiles':
      return TilesBlock(block);

    case 'TitleAndDescription':
      return TitleAndDescriptionBlock(block);

    case 'VideoBackgroundHero':
      return VideoBackgroundHeroBlock(block);

    default:
      break;
  }
}

export const renderBlock = block => {
  const background = block?.background;
  const content = render(block);
  return background ? (
    <Background colorStops={background}>{content}</Background>
  ) : (
    content
  );
};
