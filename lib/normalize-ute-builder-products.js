import { getProductImage } from '@lib/helpers';

export default function normalizeUteBuilderProducts(products) {
  const items = [];

  products?.forEach((product, index) => {
    const variants = [];

    if (!items[index]) {
      items[index] = { group: product.slug, minPrice: Infinity, variants: [] };
    }

    product?.productFields?.variants.forEach(productVariant => {
      const parentInherit = productVariant.parentInherit;
      const variantsCount = product?.productFields?.variants.length || 0;
      const image = getProductImage(productVariant);

      variants.push({
        ...productVariant,
        compatibleCovers: product.compatibleCovers,
        compatibleFactoryOptions: product.compatibleFactoryOptions,
        compatibleProducts: product.compatibleProducts,
        hidden: variantsCount > 1,
        image,
        installationCost: product.productFields.installationCost,
        isGroup: variantsCount > 1,
        isOpen: false,
        price:
          productVariant.variantDetails.price !== null
            ? productVariant.variantDetails.price
            : parentInherit && product.productFields.price,
        productCategories: product?.productCategories?.nodes.map(
          category => category.slug,
        ),
        productName: productVariant.variantName,
        productSlug: product.slug,
      });
    });

    if (variants.length > 1) {
      const image = getProductImage(variants[0], product);

      const firstVariant = {
        hidden: false,
        image,
        isGroup: true,
        price: variants[0].price,
        productName: product.title,
        uteBuilderImages: variants[0].uteBuilderImages,
        variantName: variants[0].variantName,
        variantSlug: variants[0].variantSlug,
      };

      variants.unshift(firstVariant);
    }

    items[index].minPrice = Math.min(...variants.map(variant => variant.price));
    items[index].variants = variants;
  });

  items.sort((a, b) => a.group.localeCompare(b.group));

  return items;
}
