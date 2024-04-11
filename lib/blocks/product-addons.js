import ProductAddons from '@components/product-addons/product-addons';

export default function ProductAddonsBlock(block) {
  if (!block) return null;

  const title = block.title;
  const description = block.description;

  const productAddons = block.productAddons?.map(({ product }) => {
    const genericPrice = parseFloat(product.node?.productFields?.price);
    const variantPrices =
      product.node?.productFields?.variants?.map(
        ({ variantDetails: { price } }) => price,
      ) || [];

    const candidates = [genericPrice, ...variantPrices].filter(
      price => parseFloat(price) >= 0,
    );
    const lowestPrice = candidates.length ? Math.min(...candidates) : undefined;

    return {
      ...product.node,
      ...(product.node?.featuredImage?.node && {
        featuredImage: product.node?.featuredImage?.node,
      }),
      lowestPrice,
    };
  });

  return (
    <ProductAddons
      description={description}
      products={productAddons}
      title={title}
    />
  );
}
