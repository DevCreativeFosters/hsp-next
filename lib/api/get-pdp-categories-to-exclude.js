import { getTermChildren } from '@lib/api/get-term-children';

export default async function getProductCategoriesToExclude(globalOptions) {
  let excludedCategories = [];

  if (globalOptions?.coversCategory?.nodes[0]?.slug) {
    const slug = globalOptions.coversCategory.nodes[0].slug;
    excludedCategories.push(slug);
  }

  if (globalOptions?.compatibleFactoryOptions?.nodes[0]?.slug) {
    const slug = globalOptions.compatibleFactoryOptions.nodes[0].slug;
    excludedCategories.push(slug);

    const children = await getTermChildren(slug);

    const slugs = children.map(({ slug }) => slug);
    excludedCategories = excludedCategories.concat(slugs);
  }

  if (globalOptions?.noCoverCategory?.nodes[0]?.slug) {
    const slug = globalOptions.noCoverCategory.nodes[0].slug;
    excludedCategories.push(slug);
  }

  return excludedCategories;
}
