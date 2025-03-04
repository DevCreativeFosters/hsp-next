import { NextResponse } from 'next/server';

import { getModelBySlug } from '@lib/api/get-model-by-slug';
import { getProductsWithVariants } from '@lib/api/get-products-with-variants';

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const model = params.get('model');
  const make = params.get('make');
  const excludedCategories = params.get('excludedCategories');

  try {
    const modelData = await getModelBySlug(model);
    const productsForMakeAndModelPromise = getProductsWithVariants(
      make,
      model,
      excludedCategories,
    );
    const productsWithoutMakeAndModelPromise = getProductsWithVariants(
      null,
      null,
      excludedCategories,
      true,
    ).then(products =>
      products.filter(product =>
        product.productCategories.nodes.some(
          node =>
            node.mainCategoryDetails
              .dontCreateL1AndL2PageNorFeatureInTheProductsDropdownAndPage,
        ),
      ),
    );
    const productData = (
      await Promise.all([
        productsForMakeAndModelPromise,
        productsWithoutMakeAndModelPromise,
      ])
    )
      .flat()
      .filter(
        product =>
          !product.productCategories.nodes.some(
            node => node.categoryRelations.dontIncludeInTheUteBuilder,
          ),
      );
    return NextResponse.json({ modelData, productData });
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching ${error}` },
      { status: 500 },
    );
  }
}
