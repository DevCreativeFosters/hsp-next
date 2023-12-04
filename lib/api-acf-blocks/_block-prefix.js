const PAGE_BLOCK_PREFIX = 'Page_Flexiblecontent_Blocks_';
const PRODUCT_BLOCK_PREFIX = 'Product_Flexiblecontent_Blocks_';
const PRODUCT_CATEGORY_BLOCK_PREFIX =
  'Product_category_Flexiblecontent_Blocks_';

export const getBlockPrefix = prefixType => {
  switch (prefixType) {
    case 'page':
      return PAGE_BLOCK_PREFIX;
    case 'product':
      return PRODUCT_BLOCK_PREFIX;
    case 'product_category':
      return PRODUCT_CATEGORY_BLOCK_PREFIX;
    default:
      return PAGE_BLOCK_PREFIX;
  }
};
