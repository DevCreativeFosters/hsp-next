import { getProductImage } from '@lib/helpers';

export default function normalizeUteBuilderProducts(
  products,
  isCover = false,
  isNoCover = false,
  group = null,
) {
  const items = [];

  products?.forEach((product, index) => {
    if (!product?.productFields?.variants) {
      return;
    }

    let variants = [];

    if (!items[index]) {
      items[index] = { group: product.slug, minPrice: Infinity, variants: [] };
    }

    const {
      compatibleCovers,
      compatibleFactoryOptions,
      compatibleProducts,
      productCategories,
      productFields,
      slug,
    } = product;
    const variantsCount = productFields.variants.length || 0;

    productFields.variants.forEach(variant => {
      const parentInherit = variant.parentInherit;
      const image = getProductImage(variant, product);
      const imageLayerPosition =
        productCategories?.nodes[0]?.categoryRelations?.imageLayerPosition || 1;
      const {
        compatibleCategoriesVariants,
        compatibleCoversVariants,
        variantDetails,
      } = variant;

      const category = productCategories?.nodes?.find(
        category => category.parent?.node?.id,
      );

      const title = category?.name || product.title;

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
        hidden: slug === group ? false : variantsCount > 1,
        image,
        imageLayerPosition,
        installationCost:
          variantDetails.installationCost !== null
            ? variantDetails.installationCost
            : parentInherit && productFields.installationCost,
        isGroup: slug === group ? variantsCount > 1 : variantsCount > 1,
        isNoCover: isNoCover,
        isOpen: slug === group,
        price:
          variantDetails.price !== null
            ? variantDetails.price
            : parentInherit && productFields.price,
        productCategories: productCategories?.nodes.map(
          category => category.slug,
        ),
        productName: isNoCover ? title : `${title} / ${variant.variantName}`,
        productSlug: slug,
      });
    });

    if (variants.length > 1) {
      const image = getProductImage(variants[0], product);

      let firstVariant = {
        hidden: false,
        image,
        isGroup: true,
        isNoCover: isNoCover,
        isOpen: slug === group,
        price: variants[0].price,
        productName: product.title,
        productSlug: slug,
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

  items.sort((a, b) => a.group.localeCompare(b.group));

  return items;
}
