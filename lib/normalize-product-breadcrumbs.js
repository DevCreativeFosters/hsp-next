export default function formatCategories(categoryMakesAndModels) {
  const uniqueCategories = new Map();
  const uniqueMakesAndModels = new Map();

  categoryMakesAndModels.forEach(dataObj => {
    dataObj.productCategories.nodes.forEach(category => {
      if (category.parent !== null) {
        uniqueCategories.set(category.name, category);
      }
    });

    dataObj.makesAndModels.nodes.forEach(make => {
      if (make.children.nodes.length > 0) {
        if (!uniqueMakesAndModels.has(make.name)) {
          uniqueMakesAndModels.set(make.name, []);
        }
        uniqueMakesAndModels.get(make.name).push(...make.children.nodes);
      }
    });
  });

  const deduplicatedMakesAndModels = new Map();
  uniqueMakesAndModels.forEach((models, make) => {
    const deduplicatedModels = Array.from(
      new Set(models.map(model => model.name)),
    ).map(name => models.find(model => model.name === name));

    deduplicatedMakesAndModels.set(make, deduplicatedModels);
  });

  const categories = Array.from(uniqueCategories.values()).map(category => ({
    makes: Array.from(deduplicatedMakesAndModels.entries()).map(
      ([make, models]) => ({
        make,
        models: models.map(model => ({
          label: model.name,
          value: model.slug,
        })),
      }),
    ),
    productMainCategory: category.name,
  }));

  return categories;
}
