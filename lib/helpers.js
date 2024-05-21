import routes from '@lib/routes';

export function formatPrice(price) {
  return `$${Number(price).toLocaleString('en-AU')}`;
}

export const ConditionalWrapper = ({
  children,
  condition,
  elseWrapper = wrapChildren => wrapChildren,
  wrapper,
}) => (condition ? wrapper(children) : elseWrapper(children));

export const getValueOrSlug = object => object?.value ?? object?.slug;

export const scrollIntoViewHorizontally = (container, child, offset = 0) => {
  if (!(container && child)) {
    return;
  }

  const containerEdgeRight = container.scrollLeft + container.offsetWidth;
  const childRightEdgeOffset = child.offsetLeft + child.offsetWidth;

  if (container.scrollLeft > child.offsetLeft) {
    container.scrollLeft = child.offsetLeft - offset;
  } else if (containerEdgeRight < childRightEdgeOffset) {
    container.scrollLeft += childRightEdgeOffset - containerEdgeRight + offset;
  }
};

export function getExcludeTree(globalOptions) {
  const excludeTree = [];
  const properties = ['compatibleFactoryOptions'];

  properties.forEach(property => {
    const id = globalOptions?.[property]?.nodes[0]?.databaseId;
    if (id) {
      excludeTree.push(id);
    }
  });

  return excludeTree;
}

export function shouldBeExcluded(excludeTree, categoryData) {
  if (Array.isArray(excludeTree) && categoryData?.databaseId) {
    return excludeTree.includes(categoryData.databaseId);
  }

  return false;
}

export function getProductImage(productVariant, product = null) {
  let image = productVariant?.uteBuilderImages?.icon?.node.sourceUrl;

  if (!image) {
    image =
      product?.productCategories?.nodes[0]?.categoryRelations?.icon?.node
        .sourceUrl;
  }

  if (!image) {
    image = productVariant?.uteBuilderImages.imageDesktop?.node.sourceUrl;
  }

  return image;
}

export function sortMainProductCategories(categories, mainMenu) {
  const productsMenuIndex = mainMenu.findIndex(
    item => item.url === `${routes.products}/`,
  );

  if (productsMenuIndex === -1) {
    return categories;
  }

  const productsMenu = mainMenu[productsMenuIndex]?.subItems;

  return productsMenu?.map(({ parentCategoryDatabaseId }) =>
    categories.find(
      category => category.databaseId === parentCategoryDatabaseId,
    ),
  );
}
