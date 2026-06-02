import { draftMode } from 'next/headers';

import { getPageData } from '@lib/api/get-page-data';
import { getProductCategorySeo } from '@lib/api/get-product-category-seo';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import { prepareSchemas } from '@lib/prepare-schemas';
import { metadata } from '@lib/seo';

import ContentBlocksPage from '@components/content-blocks-page/content-blocks-page';
import ProductHeroPage from '@components/product-hero-page/product-hero-page';

export async function generateMetadata({ params }) {
  if (!params?.slug) {
    return;
  }

  const data = await getProductCategorySeo(params.slug);
  let pageSeo = {};

  if (Object.keys(data).length === 0) {
    pageSeo = await getSeoByUri(params.slug);
  }

  return {
    ...metadata,
    ...data,
    ...pageSeo,
  };
}

export default async function DynamicPage({ params }) {
  const { isEnabled: isDraftEnabled } = draftMode();
  const slug = params?.slug;
  const content = await getPageData(slug, isDraftEnabled);
  const flexibleContentBlocks = content?.flexibleContent?.blocks;
  const title = content?.title;
  const pageContent = content?.content;

  if (pageContent || flexibleContentBlocks) {
    const contentBlocks = await Promise.all(
      flexibleContentBlocks?.map(block =>
        renderBlock(block, undefined, undefined, undefined, null, true),
      ) || [],
    );
    return (
      <>
        {prepareSchemas(content?.schemaProSchemas)}
        <ContentBlocksPage
          blocks={contentBlocks}
          pageContent={pageContent}
          title={title}
        />
      </>
    );
  }

  return <ProductHeroPage params={params} slug={slug} />;
}
