import routes from '@lib/routes';

export function formatPrice(price, sign = '$') {
  return `${sign}${Number(price).toLocaleString('en-AU')}`;
}

export const ConditionalWrapper = ({
  children,
  condition,
  elseWrapper = wrapChildren => wrapChildren,
  wrapper,
}) => (condition ? wrapper(children) : elseWrapper(children));

export const getValueOrSlug = object => object?.value ?? object?.slug;

export const getNameOrLabel = object => object?.name ?? object?.label;

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
  let image = productVariant?.icon;

  if (!image) {
    image = productVariant?.uteBuilderImages?.icon?.node.sourceUrl;
  }

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

export function removeLeadingSlash(route) {
  return route.replace(/^\//, '');
}

export function generateTags(slug) {
  const slugParts = slug.split('/').filter(Boolean);
  const tags = [];

  if (slugParts.length === 0) {
    tags.push('page:home');
  } else {
    tags.push(`product-category:${slugParts[0]}`);

    if (slugParts.length > 1) {
      tags.push(`make-and-model:${slugParts[1]}`);
    }

    if (slugParts.length > 2) {
      tags.push(`make-and-model:${slugParts[2]}`);
    }

    tags.push(`page:${removeLeadingSlash(slug)}`);
  }

  return tags;
}
