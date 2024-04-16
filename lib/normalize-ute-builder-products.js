export default function normalizeUteBuilderProducts(products) {
  const items = [];

  products?.forEach((product, index) => {
    const variants = [];

    if (!items[index]) {
      items[index] = { group: product.slug, minPrice: Infinity, variants: [] };
    }

    product?.productFields?.variants.forEach((productVariant, index) => {
      const parentInherit = productVariant.parentInherit;

      variants.push({
        ...productVariant,
        compatibleFactoryOptions: product.compatibleFactoryOptions,
        hidden: product?.productFields?.variants.length > 1 && index > 0,
        installationCost: product.productFields.installationCost,
        isGroup: product?.productFields?.variants.length > 1,
        isOpen: false,
        price:
          productVariant.variantDetails.price ||
          (parentInherit && product.productFields.price),
        productSlug: product.slug,
      });

      if (productVariant.variantDetails.price < items[index].minPrice) {
        items[index].minPrice = productVariant.variantDetails.price;
      }
    });

    items[index].variants = variants;
  });

  items.sort((a, b) => a.group.localeCompare(b.group));

  return items;
}
