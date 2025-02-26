import ProductGrid from '@components/product-grid';

export default function ProductGridBlock(block) {
  if (!block) return null;

  const title = block?.title;
  const titleTag = block?.titleTag;
  const titleTagStyle = block?.titleTagStyle;
  const products = block?.products;

  return (
    <ProductGrid
      products={products}
      title={title}
      titleTag={titleTag}
      titleTagStyle={titleTagStyle}
    />
  );
}
