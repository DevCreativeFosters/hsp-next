export function isProductSelected(selectedProducts, slug) {
  let isSelected = false;
  selectedProducts.forEach(selectedProduct => {
    if (selectedProduct.variantSlug === slug) {
      isSelected = true;
    }
  });

  return isSelected;
}

export function getOtherProductsWithSameParent(
  products,
  productSlug,
  variantSlug,
) {
  return products
    .filter(product => product.group === productSlug)
    .flatMap(product => product.variants)
    .filter(variant => variant.variantSlug !== variantSlug)
    .filter(variant => variant.variantSlug)
    .map(variant => {
      return variant.variantSlug;
    });
}

export function getIncompatibleProducts(products, currentProduct, covers) {
  return products
    .filter(product => product.group !== currentProduct.productSlug)
    .flatMap(product => product.variants)
    .filter(variant => variant.productSlug !== currentProduct.productSlug)
    .filter(
      variant =>
        covers &&
        variant.productCategories &&
        variant.productCategories.some(
          category => !currentProduct.compatibleProducts.includes(category),
        ),
    )
    .filter(variant => variant.variantSlug)
    .filter(
      variant => !covers.some(cover => cover.group === variant.productSlug),
    )
    .map(variant => variant.variantSlug);
}
