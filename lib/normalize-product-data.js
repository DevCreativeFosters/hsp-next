import routes from './routes';

export default function normalizeProductData(categories) {
  const subcategories = categories?.reduce((accumulator, category) => {
    if (category.children && category.children.nodes.length > 0) {
      accumulator.push(...category.children.nodes);
    }
    return accumulator;
  }, []);

  return subcategories
    .filter(
      child =>
        !child.mainCategoryDetails
          ?.dontCreateL1AndL2PageNorFeatureInTheProductsDropdownAndPage,
    )
    .map(child => {
      const imageUrl =
        child.mainCategoryDetails?.productImage?.node?.mediaItemUrl;
      const productUrl = routes.product(child.slug);

      return {
        categoryId: child.parent?.node?.id,
        id: child.databaseId,
        image: imageUrl || undefined,
        title: child.name,
        url: productUrl,
      };
    });
}
