import ProductMakeGrid from '@components/product-make-grid/product-make-grid';

export default function ProductMakeGridBlock(block) {
  if (!block) return null;

  const alignment = block?.alignment;
  const title = block?.title;
  const titleTag = block?.titleTag;
  const titleTagStyle = block?.titleTagStyle;
  const bodyText = block?.bodyText;
  const productsPerPage = block?.productsPerPage;
  const productsPerPageMobile = block?.productsPerPageMobile;
  const productsTitleTag = block?.productsTitleTag;
  const productsTitleTagStyle = block?.productsTitleTagStyle;
  const products = block?.products;
  const categoryPages = block?.categoryPages;
  const showFilters = block?.showFilters;
  const selectTemplate = block.selectTemplate?.[0];

  return (
    <ProductMakeGrid
      alignment={alignment}
      bodyText={bodyText}
      categoryPages={categoryPages}
      products={products}
      productsPerPage={productsPerPage}
      productsPerPageMobile={productsPerPageMobile}
      productsTitleTag={productsTitleTag}
      productsTitleTagStyle={productsTitleTagStyle}
      showCategories={false}
      showFilters={showFilters}
      showMakes={true}
      template={selectTemplate}
      title={title}
      titleTag={titleTag}
      titleTagStyle={titleTagStyle}
    />
  );
}
