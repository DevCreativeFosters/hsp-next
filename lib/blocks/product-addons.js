import ProductAddons from '@components/product-addons/product-addons';

export default function ProductAddonsBlock(block) {
  if (!block) return null;

  const title = block.title;
  const description = block.description;
  const productAddons = block.productAddons.map(({ product }) => ({
    ...product,
    ...(product.featuredImage && {
      featuredImage: product.featuredImage?.node,
    }),
  }));

  return (
    <ProductAddons
      title={title}
      description={description}
      products={productAddons}
    />
  );
}
