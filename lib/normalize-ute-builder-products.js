export default function normalizeUteBuilderProducts(products) {
  const variants = [];

  products?.forEach(product => {
    if (product.productFields.variants) {
      product.productFields.variants.forEach(productVariant => {
        const parentInherit = productVariant.parentInherit;

        variants.push({
          ...productVariant,
          compatibleFactoryOptions: product.compatibleFactoryOptions,
          installationCost: product.productFields.installationCost,
          price:
            productVariant.variantDetails.price ||
            (parentInherit && product.productFields.price),
          productSlug: product.slug,
        });
      });
    }
  });

  return variants;
}
