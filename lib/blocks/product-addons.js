import ProductAddons from '@components/product-addons/product-addons';

export default function ProductAddonsBlock(block) {
  if (!block) return null;

  const title = block.title;
  const description = block.description;
  const productAddons = block.productAddons.map(({ product }) => {
    const genericPrice = parseFloat(product.productFields.price);
    const variantPrices =
      product.productFields.variants?.map(
        ({ variantDetails: { price } }) => price,
      ) || [];

    const candidates = [genericPrice, ...variantPrices].filter(
      price => parseFloat(price) >= 0,
    );
    const lowestPrice = candidates.length ? Math.min(...candidates) : undefined;

    return {
      ...product,
      ...(product.featuredImage && {
        featuredImage: product.featuredImage?.node,
      }),
      lowestPrice,
    };
  });

  return (
    <ProductAddons
      title={title}
      description={description}
      products={productAddons}
    />
  );
}
