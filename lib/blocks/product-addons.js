import ProductAddons from '@components/product-addons/product-addons';

export default function ProductAddonsBlock(block) {
  if (!block) return null;

  const { description, productAddons, title } = block;

  const normalizeEntity = (entity, type, relatedCategoryIds = []) => {
    switch (type) {
      case 'product':
        const genericPrice = parseFloat(entity.node?.productFields?.price);
        const variantPrices =
          entity.node?.productFields?.variants?.map(variant =>
            parseFloat(variant.variantDetails.price),
          ) || [];
        const prices = [genericPrice, ...variantPrices].filter(
          price => !isNaN(price),
        );
        const lowestPrice = prices.length ? Math.min(...prices) : undefined;

        return {
          id: entity.node.id,
          imageUrl: entity.node.featuredImage?.node?.sourceUrl || null,
          link: entity.node.link,
          lowestPrice,
          makesAndModels: entity.node.makesAndModels.nodes || [],
          productCategories: entity.node.productCategories.nodes || [],
          slug: entity.node.slug,
          title: entity.node.title,
          uri: entity.node.uri,
        };

      case 'productCategory':
        const categoryDetails = entity?.nodes[0];
        return {
          categorySlug: categoryDetails?.slug || '#',
          id: categoryDetails?.id || null,
          imageUrl:
            categoryDetails?.mainCategoryDetails?.featuredImage?.node
              ?.mediaItemUrl || null,
          lowestPrice:
            categoryDetails?.mainCategoryDetails?.fromPrice || undefined,
          makesAndModels: [],
          productCategories: [],
          title: categoryDetails?.name || '',
        };

      case 'productMake':
        const makeDetails = entity.nodes
          .flatMap(node =>
            node.detailsFields?.details.map(detail => ({
              ...node,
              detail,
              matchingCategoryId: detail?.relatedProductCategory?.nodes[0]?.id,
            })),
          )
          .find(({ matchingCategoryId }) =>
            relatedCategoryIds.includes(matchingCategoryId),
          );

        if (!makeDetails) return null;

        const relatedCategoryName =
          makeDetails.detail?.relatedProductCategory?.nodes[0]?.name || '';
        const relatedCategorySlug =
          makeDetails.detail?.relatedProductCategory?.nodes[0]?.slug || '#';

        return {
          categorySlug: relatedCategorySlug,
          id: makeDetails.id,
          imageUrl:
            makeDetails.detail?.featuredImage?.node?.mediaItemUrl || null,
          lowestPrice: makeDetails.detail?.fromPrice || undefined,
          makeSlug: makeDetails.slug || '',
          makesAndModels: [],
          productCategories: [],
          title: `${makeDetails.name} ${relatedCategoryName}`,
        };

      default:
        return {};
    }
  };

  const processedAddons = productAddons
    ?.map(item => {
      if (item.product) {
        return normalizeEntity(item.product, 'product');
      } else if (item.productCategory) {
        return normalizeEntity(item.productCategory, 'productCategory');
      } else if (item.productMake && item.productMakeRelatedProductCategory) {
        const relatedCategoryIds =
          item.productMakeRelatedProductCategory.nodes.map(cat => cat.id);
        return normalizeEntity(
          item.productMake,
          'productMake',
          relatedCategoryIds,
        );
      }
      return null;
    })
    .filter(Boolean);

  if (!processedAddons.length) {
    return null;
  }

  return (
    <ProductAddons
      description={description}
      products={processedAddons}
      title={title}
    />
  );
}
