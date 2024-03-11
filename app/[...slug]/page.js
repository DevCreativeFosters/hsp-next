import { notFound } from 'next/navigation';
import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import Container from '@components/container/container';
import styles from './page.module.scss';

export async function generateMetadata({ params }) {
  const content = await getPageData(params?.slug);

  return {
    title: `HSP 4x4 - ${content?.title}`,
  };
}

export default async function HomePage({ params }) {
  const content = await getPageData(params?.slug);
  const contentBlocks = content?.flexibleContent?.blocks?.map(renderBlock);
  const title = content?.title;
  const pageContent = content?.content;

  if (!content) return notFound();

  return (
    <Layout withMap>
      <Container className={styles.container}>
        {title && <h1>{title}</h1>}
        {pageContent && <Wysiwyg content={pageContent} />}
      </Container>
      {contentBlocks?.map(contentBlock => contentBlock)}
    </Layout>
  );
}
