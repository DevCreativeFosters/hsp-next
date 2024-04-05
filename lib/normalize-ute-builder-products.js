export default function normalizeUteBuilderProducts(products) {
  const variants = [];

  products?.forEach(product => {
    if (product.productFields.variants) {
      product.productFields.variants.forEach(productVariant => {
        const parentInherit = productVariant.parentInherit;

        variants.push({
          ...productVariant,
          price:
            productVariant.variantDetails.price ||
            (parentInherit && product.productFields.price),
          installationCost: product.productFields.installationCost,
          productSlug: product.slug,
        });
      });
    }
  });

  return variants;
}
