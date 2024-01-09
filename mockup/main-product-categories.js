const SUBC = {
  databaseId: 48,
  id: 'dGVybTo0OA==',
  name: 'Test child product',
  slug: 'test-child-product-1',
  parent: { node: [Object] },
  mainCategoryDetails: {
    // featuredImage: [Object],
    fromPrice: null,
    // productImage: [Object],
    videoUrl: null,
    features:
      '<ul>\n<li>feature 1</li>\n<li>feature 2</li>\n<li>feature 3</li>\n</ul>\n',
    // warranty: [Object],
  },
};

export const mainProductCategories = [
  {
    databaseId: 0,
    id: 'dGVybTo0Ng==',
    name: 'With 1',
    description: null,
    children: { nodes: [] },
  },
  {
    databaseId: 1,
    id: 'dGVybTo0Ng==',
    name: 'With 2',
    description: null,
    children: { nodes: [SUBC] },
  },
  {
    databaseId: 2,
    id: 'dGVybTo0Ng==',
    name: 'With 3',
    description: null,
    children: { nodes: [SUBC, SUBC] },
  },
  {
    databaseId: 3,
    id: 'dGVybTo0Ng==',
    name: 'With 4',
    description: null,
    children: { nodes: [SUBC, SUBC, SUBC] },
  },
  {
    databaseId: 4,
    id: 'dGVybTo0Ng==',
    name: 'With 5',
    description: null,
    children: { nodes: [SUBC, SUBC, SUBC, SUBC] },
  },
  {
    databaseId: 5,
    id: 'dGVybTo0Ng==',
    name: 'With 6',
    description: null,
    children: { nodes: [SUBC, SUBC, SUBC, SUBC, SUBC] },
  },
  {
    databaseId: 6,
    id: 'dGVybTo0Ng==',
    name: 'With 7',
    description: null,
    children: { nodes: [SUBC, SUBC, SUBC, SUBC, SUBC, SUBC] },
  },
  {
    databaseId: 7,
    id: 'dGVybTo0Ng==',
    name: 'With 8',
    description: null,
    children: { nodes: [SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC] },
  },
  {
    databaseId: 8,
    id: 'dGVybTo0Ng==',
    name: 'With 9',
    description: null,
    children: { nodes: [SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC] },
  },
  {
    databaseId: 9,
    id: 'dGVybTo0Ng==',
    name: 'With 10',
    description: null,
    children: {
      nodes: [SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC],
    },
  },
  {
    databaseId: 10,
    id: 'dGVybTo0Ng==',
    name: 'With 11',
    description: null,
    children: {
      nodes: [SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC],
    },
  },
  {
    databaseId: 11,
    id: 'dGVybTo0Ng==',
    name: 'With 12',
    description: null,
    children: {
      nodes: [SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC, SUBC],
    },
  },
];
