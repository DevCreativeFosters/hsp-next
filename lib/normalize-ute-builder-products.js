export default function normalizeUteBuilderProducts(products) {
  const items = [];

  products?.forEach((product, index) => {
    const variants = [];

    if (!items[index]) {
      items[index] = { group: product.slug, minPrice: Infinity, variants: [] };
    }

    if (product.productFields.variants) {
      product.productFields.variants.forEach(productVariant => {
        const parentInherit = productVariant.parentInherit;

        variants.push({
          ...productVariant,
          compatibleFactoryOptions: product.compatibleFactoryOptions,
          hidden: false,
          installationCost: product.productFields.installationCost,
          price:
            productVariant.variantDetails.price ||
            (parentInherit && product.productFields.price),
          productSlug: product.slug,
        });

        if (productVariant.variantDetails.price < items[index].minPrice) {
          items[index].minPrice = productVariant.variantDetails.price;
        }
      });
    }

    items[index].variants = variants;
  });

  items.sort((a, b) => a.group.localeCompare(b.group));

  items.forEach(item => {
    if (item.variants.length > 1) {
      item.variants.forEach((variant, index) => {
        if (index > 0) {
          variant.hidden = true;
        }
      });
    }
  });

  return items;
}
