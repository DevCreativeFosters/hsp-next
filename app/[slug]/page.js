import { draftMode } from 'next/headers';

import { getPageData } from '@lib/api/get-page-data';
import { getProductCategorySeo } from '@lib/api/get-product-category-seo';
import { renderBlock } from '@lib/block';
import { metadata } from '@lib/seo';

import ContentBlocksPage from '@components/content-blocks-page/content-blocks-page';
import ProductHeroPage from '@components/product-hero-page/product-hero-page';

export async function generateMetadata({ params }) {
  if (!params?.slug) {
    return;
  }

  const data = await getProductCategorySeo(params.slug);

  return {
    ...metadata,
    ...data,
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
      flexibleContentBlocks?.map(renderBlock) || [],
    );
    return (
      <ContentBlocksPage
        blocks={contentBlocks}
        pageContent={pageContent}
        title={title}
      />
    );
  }

  return <ProductHeroPage params={params} slug={slug} />;
}

export async function generateStaticParams() {
  return [];
}
