export default function normalizeUteBuilderProducts(products) {
  const items = [];

  products?.forEach((product, index) => {
    const variants = [];

    if (!items[index]) {
      items[index] = { group: product.slug, minPrice: Infinity, variants: [] };
    }

    product?.productFields?.variants.forEach(productVariant => {
      const parentInherit = productVariant.parentInherit;

      variants.push({
        ...productVariant,
        compatibleFactoryOptions: product.compatibleFactoryOptions,
        hidden: product?.productFields?.variants.length > 1,
        installationCost: product.productFields.installationCost,
        isGroup: product?.productFields?.variants.length > 1,
        isOpen: false,
        price:
          productVariant.variantDetails.price ||
          (parentInherit && product.productFields.price),
        productName: product.title,
        productSlug: product.slug,
      });
    });

    if (variants.length > 1) {
      const firstVariant = {
        hidden: false,
        isGroup: true,
        price: variants[0].price,
        uteBuilderImages: variants[0].uteBuilderImages,
        variantName: variants[0].productName,
      };

      variants.unshift(firstVariant);
    }

    items[index].minPrice = Math.min(...variants.map(variant => variant.price));
    items[index].variants = variants;
  });

  items.sort((a, b) => a.group.localeCompare(b.group));

  return items;
}
