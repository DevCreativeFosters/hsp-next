export default function normalizeProductData(products) {
  return (
    products.map(item => {
      return {
        id: item.productId,
        title: item.title,
        url: `${item.productCategories?.nodes[0]?.slug}/${item?.slug}`,
        categoryId: item.productCategories?.nodes[0]?.id,
        image: item.featuredImage?.node?.sourceUrl,
      };
    }) || []
  );
}
