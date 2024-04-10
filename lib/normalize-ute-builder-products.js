export default function normalizeUteBuilderProducts(products) {
  const variants = [];

  products?.forEach(product => {
    if (product.productFields.variants) {
      product.productFields.variants.forEach(productVariant => {
        const parentInherit = productVariant.parentInherit;

        variants.push({
          ...productVariant,
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

export function normalizeCompatibilityData(data) {
  const normalizedData = {};

  data?.forEach(item => {
    if (!item.categoryRelations) {
      return;
    }

    normalizedData[item.slug] = {
      covers: item.categoryRelations?.covers?.nodes || null,
      factoryOptions: item.categoryRelations?.factoryOptions?.nodes || null,
      products: item.categoryRelations?.productMatrix?.nodes || null,
    };
  });

  return normalizedData;
}
