import ProductMakeGrid from '@components/product-make-grid';

export default function ProductMakeGridBlock(block) {
  if (!block) return null;

  const title = block?.title;
  const titleTag = block?.titleTag;
  const titleTagStyle = block?.titleTagStyle;
  const bodyText = block?.bodyText;
  const productsPerPage = block?.productsPerPage;
  const productsPerPageMobile = block?.productsPerPageMobile;
  const products = block?.products;

  return (
    <ProductMakeGrid
      bodyText={bodyText}
      products={products}
      productsPerPage={productsPerPage}
      productsPerPageMobile={productsPerPageMobile}
      title={title}
      titleTag={titleTag}
      titleTagStyle={titleTagStyle}
    />
  );
}
