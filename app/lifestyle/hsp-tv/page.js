import { getHspTvPosts } from '@lib/api/get-hsp-tv-posts';
import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Pagination from '@components/pagination/pagination';
import PostsList from '@components/posts-list/posts-list';
import SectionIntro from '@components/section-intro/section-intro';

import styles from '../page.module.scss';

const POSTS_PER_PAGE = 12;

export async function generateMetadata() {
  const data = await getSeoByUri(routes.lifestyleTv);

  return {
    ...metadata,
    ...data,
  };
}

export default async function HspTVPage({ searchParams }) {
  const currentPage = Number(searchParams?.page) || 1;
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const postsResponse = await getHspTvPosts(POSTS_PER_PAGE, offset);
  const posts = postsResponse?.hspTvPosts.nodes || [];
  const totalPosts =
    postsResponse?.hspTvPosts.pageInfo.offsetPagination.total || 0;

  const content = await getPageData('lifestyle/hsp-tv');
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks.map(renderBlock) || [],
  );

  return (
    <Layout title="">
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsLifestyle initialContentTypeRoute={routes.tv()} />
        </div>
        <SectionIntro
          description={content?.content}
          fitInline
          title={content?.title}
        />
        {contentBlocks}
        <PostsList perPage={POSTS_PER_PAGE} posts={posts} variant="hsp-tv" />
        {totalPosts > POSTS_PER_PAGE && (
          <Pagination
            current={currentPage}
            perPage={POSTS_PER_PAGE}
            total={totalPosts}
            urlBase={routes.tv()}
          />
        )}
      </Container>
    </Layout>
  );
}
