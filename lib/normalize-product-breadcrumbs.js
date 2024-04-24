export default function formatCategories(categoryMakesAndModels) {
  const categories = new Map();

  categoryMakesAndModels.forEach(dataObj => {
    dataObj.productCategories.nodes.forEach(category => {
      if (!categories.has(category.slug)) {
        categories.set(category.slug, {
          category: {
            name: category.name,
            slug: category.slug,
          },
          makes: [],
          name: category.name,
          slug: category.slug,
        });
      }

      dataObj.makesAndModels.nodes.forEach(make => {
        const categoryMakes = categories.get(category.slug).makes;
        if (!categoryMakes.find(m => m.slug === make.slug)) {
          const uniqueModels = Array.from(
            new Set(make.children.nodes.map(model => model.slug)),
          ).map(slug => make.children.nodes.find(model => model.slug === slug));

          if (uniqueModels.length > 0) {
            categoryMakes.push({
              models: uniqueModels,
              name: make.name,
              slug: make.slug,
            });
          }
        }
      });
    });
  });

  return Array.from(categories.values());
}
