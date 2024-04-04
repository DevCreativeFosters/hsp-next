import { NextResponse } from 'next/server';

import { getModelBySlug } from '@lib/api/get-model-by-slug';
import { getProductsWithVariants } from '@lib/api/get-products-with-variants';

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const model = params.get('model');
  const make = params.get('make');

  try {
    const modelData = await getModelBySlug(model);
    const productData = await getProductsWithVariants(make, model);
    return NextResponse.json({ modelData, productData });
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching ${error}` },
      { status: 500 },
    );
  }
}
