import { getPageData } from '@lib/api/get-page-data';
import { getHspTvPosts } from '@lib/api/get-hsp-tv-posts';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import PostsList from '@components/posts-list/posts-list';
import Pagination from '@components/pagination/pagination';
import styles from '../page.module.scss';

const POSTS_PER_PAGE = 12;

export const metadata = {
  title: 'HSP 4x4 - HSP TV',
  // description: ''
};

export default async function HspTVPage({ searchParams }) {
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const postsResponse = await getHspTvPosts(POSTS_PER_PAGE, offset);
  const posts = postsResponse?.hspTvPosts.nodes || [];
  const totalPosts =
    postsResponse?.hspTvPosts.pageInfo.offsetPagination.total || 0;

  const content = await getPageData('lifestyle/hsp-tv');
  const contentResolved = content?.flexibleContent?.blocks.map(renderBlock);

  return (
    <Layout title="">
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsLifestyle initialContentTypeRoute={routes.tv()} />
        </div>
        {contentResolved}
        <PostsList variant="hsp-tv" posts={posts} perPage={POSTS_PER_PAGE} />
        {totalPosts > POSTS_PER_PAGE && (
          <Pagination
            perPage={POSTS_PER_PAGE}
            total={totalPosts}
            current={currentPage}
            urlBase={routes.tv()}
          />
        )}
      </Container>
    </Layout>
  );
}
