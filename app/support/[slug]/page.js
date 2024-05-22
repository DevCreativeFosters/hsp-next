import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';

import BreadcrumbsSupport from '@components/breadcrumbs-support/breadcrumbs-support';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';
import PageGrid from '@components/page-grid/page-grid';
import Sidebar from '@components/sidebar/sidebar';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './page.module.scss';

export async function generateMetadata({ params }) {
  const data = await getSeoByUri(`${routes.support()}/${params.slug}`);

  return {
    ...data,
  };
}

export default async function SupportSubpage({ params }) {
  const supportUrl = routes.support(params.slug);
  const content = await getPageData(supportUrl);
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);
  const accordions = content?.supportPagesContent?.accordions;

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
                      label: content?.title,
                      strong: true,
                      url: routes.support(params.slug),
                    }}
                  />
                </div>
                {contentBlocks?.map((contentBlock, index) => (
                  <Fragment key={index}>{contentBlock}</Fragment>
                ))}
              </Sidebar>
              <div className={styles.contentContainer}>
                {content?.title && (
                  <h1 className={styles.title}>{content.title}</h1>
                )}
                {content && (
                  <Wysiwyg
                    accordions={accordions}
                    className={styles.content}
                    content={content?.content}
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
