import extractWordBetween from '@lib/extract-word-between';
import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';
import Reviews from '@components/reviews/reviews';

export default function ReviewsBlock(block, mainCategoryContentBlocks) {
  let data = block;

  if (mainCategoryContentBlocks && block?.inheritFromMainCategory) {
    let mainCategoryReviewsData = mainCategoryContentBlocks.find(block => {
      const blockName = extractWordBetween(
        block?.fieldGroupName,
        blockPrefix,
        blockSuffix,
      );

      if (blockName === 'Reviews') {
        return block;
      }
    });

    data = mainCategoryReviewsData || block;
  }

  return <Reviews data={data} />;
}
