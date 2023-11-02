import { Fragment } from 'react';
import { getPageData, getPageGutenbergContent } from '@lib/api';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import BreadcrumbsSupport from '@components/breadcrumbs-support/breadcrumbs-support';
import styles from './page.module.scss';
import PageGrid from '@components/page-grid/page-grid';
import PageContainer from '@components/page-container/page-container';
import Sidebar from '@components/sidebar/sidebar';

export const metadata = {
  title: 'HSP 4x4 - Support',
};

export default async function SupportSubpage({ params }) {
  const gutenbergContent = await getPageGutenbergContent(
    `support/${params.slug}`,
  );
  const content = await getPageData(`support/${params.slug}`);
  const contentBlocks = content?.flexibleContent.blocks.map(renderBlock);

  return (
    <Layout>
      <Container>
        <div className={styles.page}>
          <PageContainer>
            <PageGrid variant="post">
              <Sidebar>
                <div className={styles.breadcrumbs}>
                  <BreadcrumbsSupport
                    exactBreadcrumb={{
                      label: content.title,
                      url: routes.support(params.slug),
                      strong: true,
                    }}
                  />
                </div>
                {contentBlocks?.map((contentBlock, index) => (
                  <Fragment key={index}>{contentBlock}</Fragment>
                ))}
              </Sidebar>
              <div className={styles.contentContainer}>
                {content?.title && (
                  <h1 className={styles.title}>{content?.title}</h1>
                )}
                {content && (
                  <Wysiwyg
                    className={styles.content}
                    content={gutenbergContent}
                  />
                )}
              </div>
            </PageGrid>
          </PageContainer>
        </div>
      </Container>
    </Layout>
  );
}
