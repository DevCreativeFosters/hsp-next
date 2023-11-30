import routes from './routes';

export default function normalizeProductData(categories) {
  const subcategories = categories.reduce((accumulator, category) => {
    if (category.children && category.children.nodes.length > 0) {
      accumulator.push(...category.children.nodes);
    }
    return accumulator;
  }, []);

  return subcategories.map(child => {
    const imageUrl = child.mainCategoryDetails?.productImage?.mediaItemUrl;
    const productUrl = routes.product(child.slug);

    return {
      id: child.databaseId,
      title: child.name,
      url: productUrl,
      categoryId: child.parent?.node?.id,
      image: imageUrl || undefined,
    };
  });
}
