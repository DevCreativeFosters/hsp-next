import { fetchAPI } from '@lib/fetch-api';

export async function getAllMakes() {
  const query = /* GraphQL */ `
    query getAllMakes {
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
                label
                value
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query);

  const makes = data.makesAndModels?.nodes;

  return makes.map(make => {
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
