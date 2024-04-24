import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import ContentBlocksPage from '@components/content-blocks-page/content-blocks-page';
import ProductHeroPage from '@components/product-hero-page/product-hero-page';

export default async function DynamicPage({ params }) {
  const slug = params?.slug;
  const content = await getPageData(slug);
  const block = content?.flexibleContent?.blocks?.map(renderBlock);
  const title = content?.title;
  const pageContent = content?.content;

  if (pageContent || block) {
    return (
      <ContentBlocksPage
        blocks={block}
        pageContent={pageContent}
        title={title}
      />
    );
  }

  return <ProductHeroPage params={params} slug={slug} />;
}
