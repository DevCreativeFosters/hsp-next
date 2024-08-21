import { getProductImage } from '@lib/helpers';

import { sortProducts } from '@components/builder/helpers';

export default function normalizeUteBuilderProducts(
  products,
  isCover = false,
  group = null,
) {
  const items = [];

  products?.forEach((product, index) => {
    if (!product?.productFields?.variants) {
      return;
    }

    let variants = [];

    if (!items[index]) {
      items[index] = {
        group: product.slug,
        minPrice: Infinity,
        productCategories: product?.productCategories || [],
        variants: [],
      };
    }

    const {
      compatibleCovers,
      compatibleFactoryOptions,
      compatibleProducts,
      noCover,
      productCategories,
      productFields,
      slug,
    } = product;
    const variantsCount = productFields.variants.length || 0;

    productFields.variants.forEach(variant => {
      const parentInherit = variant.parentInherit;
      const icon =
        productCategories?.nodes[0]?.categoryRelations?.icon?.node?.sourceUrl ||
        null;
      const image = getProductImage(variant, product);
      const imageLayerPosition =
        productCategories?.nodes[0]?.categoryRelations?.imageLayerPosition || 1;
      const {
        compatibleCategoriesVariants,
        compatibleCoversVariants,
        variantDetails,
      } = variant;

      const title = getProductTitle(product);

      variants.push({
        ...variant,
        compatibleCategoriesVariants:
          compatibleCategoriesVariants?.nodes?.map(category => category.slug) ||
          [],
        compatibleCovers,
        compatibleCoversVariants:
          compatibleCoversVariants?.nodes?.map(category => category.slug) || [],
        compatibleFactoryOptions,
        compatibleProducts,
        freight: productFields.freight,
        hidden: slug === group ? false : variantsCount > 1,
        icon,
        image,
        imageLayerPosition,
        installationCost:
          variantDetails.installationCost !== null
            ? variantDetails.installationCost
            : parentInherit && productFields.installationCost,
        isGroup: slug === group ? variantsCount > 1 : variantsCount > 1,
        isNoCover: noCover,
        isOpen: slug === group,
        price:
          variantDetails.price !== null
            ? variantDetails.price
            : parentInherit && productFields.price,
        productCategories: productCategories?.nodes.map(
          category => category.slug,
        ),
        productName: noCover ? title : `${title} / ${variant.variantName}`,
        productSlug: slug,
        productTitle:
          variantsCount > 1
            ? isCover
              ? title
              : `${title} / ${variant.variantName}`
            : title,
      });
    });

    if (variants.length > 1) {
      const image = getProductImage(variants[0], product);

      let firstVariant = {
        hidden: false,
        icon:
          productCategories?.nodes[0]?.categoryRelations?.icon?.node
            ?.sourceUrl || null,
        image,
        isGroup: true,
        isNoCover: noCover,
        isOpen: slug === group,
        price: variants[0].price,
        productName: product.title,
        productSlug: slug,
        productTitle: getProductTitle(product),
        uteBuilderImages: variants[0].uteBuilderImages,
        variantName: variants[0].variantName,
      };

      if (isCover) {
        firstVariant = {
          ...variants[0],
          hidden: false,
          image,
          isGroup: false,
        };

        firstVariant.hidden = false;
        firstVariant.image = image;
        firstVariant.isGroup = false;
      }

      variants.unshift(firstVariant);
    }

    items[index].minPrice = Math.min(...variants.map(variant => variant.price));
    items[index].variants = variants;
  });

  return sortProducts(items);
}

/**
 * Helper function to get product title
 *
 * @param product
 * @returns {*}
 */
function getProductTitle(product) {
  const { productCategories } = product;

  const category = productCategories?.nodes?.find(
    category => category.parent?.node?.id,
  );

  return category?.name || product.title;
}
