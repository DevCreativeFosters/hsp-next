import { getTermChildren } from '@lib/api/get-term-children';

export default async function getCategoriesToExclude(globalOptions) {
  let excludedCategories = [];

  if (globalOptions?.coversCategory?.nodes[0]?.slug) {
    const slug = globalOptions.coversCategory.nodes[0].slug;
    excludedCategories.push(slug);

    const children = await getTermChildren(slug);

    const slugs = children.map(({ slug }) => slug);
    excludedCategories = excludedCategories.concat(slugs);
  }

  if (globalOptions?.compatibleFactoryOptions?.nodes[0]?.slug) {
    const slug = globalOptions.compatibleFactoryOptions.nodes[0].slug;
    excludedCategories.push(slug);

    const children = await getTermChildren(slug);

    const slugs = children.map(({ slug }) => slug);
    excludedCategories = excludedCategories.concat(slugs);
  }

  return excludedCategories;
}
