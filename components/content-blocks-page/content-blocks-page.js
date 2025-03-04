import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from '../../app/[...segments]/_product-category-or-dynamic-page/page.module.scss';

export default async function ContentBlocksPage({
  blocks,
  pageContent,
  title,
}) {
  return (
    <Layout withMap>
      {pageContent && (
        <Container className={styles.container}>
          {title && <h1>{title}</h1>}
          {pageContent && <Wysiwyg content={pageContent} />}
        </Container>
      )}
      {blocks && blocks?.map(block => block)}
    </Layout>
  );
}
