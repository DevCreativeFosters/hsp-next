export default async function getModelWithVariants(
  model,
  make,
  excludedCategories,
) {
  const response = await fetch(
    `/api/ute-builder?model=${model}&make=${make}&excludedCategories=${excludedCategories}`,
  );

  return await response.json();
}
