export default function filterMakersByCategory(
  makersAndModels,
  mainCategorySlug,
) {
  const category = makersAndModels.find(
    category => category.category.slug === mainCategorySlug,
  );

  if (!category) {
    return [];
  }

  return category.makes.map(make => ({
    ...make,
    models: make.models,
  }));
}
