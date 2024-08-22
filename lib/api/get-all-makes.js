import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';

export const query = `
  makesAndModels(where: { parent: null }, first: 100) {
    nodes {
      databaseId
      name
      slug
      children {
        nodes {
          name
          slug
          databaseId
          compatibleFactoryOptions {
            ...ProductFragment
          }
        }
      }
    }
  }
`;

export async function getAllMakes() {
  const data = await fetchAPI(`
    ${ProductWithVariants}
    query getAllMakes { ${query} }
  `);
  return getResult(data);
}

export function getResult(data) {
  const makes = data?.makesAndModels?.nodes || [];

  return makes?.map(make => {
    return {
      models: make.children.nodes.map(
        ({ compatibleFactoryOptions, name, slug }) => {
          return {
            compatibleFactoryOptions,
            name,
            slug,
          };
        },
      ),
      name: make.name,
      slug: make.slug,
    };
  });
}
