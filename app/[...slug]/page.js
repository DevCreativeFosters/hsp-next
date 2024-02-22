import { notFound } from 'next/navigation';
import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';

export async function generateMetadata({ params }) {
  const content = await getPageData(params?.slug);

  return {
    title: `HSP 4x4 - ${content?.title}`,
  };
}

export default async function HomePage({ params }) {
  const content = await getPageData(params?.slug);
  const contentBlocks = content?.flexibleContent?.blocks?.map(renderBlock);

  if (!content) return notFound();

  return (
    <Layout withMap>{contentBlocks.map(contentBlock => contentBlock)}</Layout>
  );
}
