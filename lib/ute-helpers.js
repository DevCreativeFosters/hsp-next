export function isProductSelected(selectedProducts, slug) {
  let isSelected = false;
  selectedProducts.forEach(selectedProduct => {
    if (selectedProduct.variantSlug === slug) {
      isSelected = true;
    }
  });

  return isSelected;
}
