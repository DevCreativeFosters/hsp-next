import getAllPagesSlugs from '@lib/api/get-all-pages-slugs';
import { getPageData } from '@lib/api/get-page-data';
import { getProductCategorySeo } from '@lib/api/get-product-category-seo';
import { renderBlock } from '@lib/block';

import ContentBlocksPage from '@components/content-blocks-page/content-blocks-page';
import ProductHeroPage from '@components/product-hero-page/product-hero-page';

export async function generateMetadata({ params }) {
  if (!params?.slug) {
    return;
  }

  const data = await getProductCategorySeo(params.slug);

  return {
    ...data,
  };
}

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

export async function generateStaticParams() {
  const parents = ['support'];

  let excludedMainSlugs = [
    'australian-made',
    'contact-us',
    'lifestyle',
    'hsp-blog',
    'hsp-celebrities',
    'hsp-tv',
    'products',
    'store-locator',
    'support',
    'ute-builder',
    'home',
  ];

  const pages = await getAllPagesSlugs();

  const excludedChildSlugs = pages
    .filter(page => parents.includes(page.slug))
    .flatMap(page => page.children.nodes.map(child => child.slug));

  return pages
    .filter(page => !excludedMainSlugs.includes(page.slug))
    .filter(page => !excludedChildSlugs.includes(page.slug))
    .map(page => ({ slug: page.slug }));
}
