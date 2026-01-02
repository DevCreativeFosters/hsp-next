import { Fragment } from 'react';

import clsx from 'clsx';
import { notFound } from 'next/navigation';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import { removeLeadingSlash } from '@lib/helpers';
import { prepareSchemas } from '@lib/prepare-schemas';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import BreadcrumbsSupport from '@components/breadcrumbs-support/breadcrumbs-support';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';
import PageGrid from '@components/page-grid/page-grid';
import RegisterYourProduct from '@components/register-your-product/register-your-product';
import Sidebar from '@components/sidebar/sidebar';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './page.module.scss';

export async function generateMetadata({ params }) {
  const supportPagePath = `${routes.support()}/${params.slug}`;
  const tags = [`page:${removeLeadingSlash(supportPagePath)}`];
  const data = await getSeoByUri(supportPagePath, tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function SupportSubpage({ params }) {
  const supportUrl = routes.support(params.slug);
  const content = await getPageData(supportUrl);
  const parent = content?.parent;
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks.map(renderBlock) || [],
  );
  const accordions = content?.supportPagesContent?.accordions;

  if (!parent) {
    return notFound();
  }

  return (
    <Layout>
      {prepareSchemas(content?.schemaProSchemas)}
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
                  <h1 className={clsx(styles.title, 'h1')}>{content.title}</h1>
                )}
                {content && (
                  <Wysiwyg
                    accordions={accordions}
                    className={styles.content}
                    content={content?.content}
                  />
                )}

                {/* Only for '/support/register-your-product' */}
                {<RegisterYourProduct />}
              </div>
            </PageGrid>
          </PageContainer>
        </div>
      </Container>
    </Layout>
  );
}

export async function generateStaticParams() {
  return [];
}
