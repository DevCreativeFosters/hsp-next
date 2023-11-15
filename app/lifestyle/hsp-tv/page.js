import { getAllHspTvPosts, getPageData } from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import PostsList from '@components/posts-list/posts-list';
import Pagination from '@components/pagination/pagination';
import { PaginationContextProvider } from '@contexts/pagination';
import routes from '@lib/routes';
import styles from '../page.module.scss';

const POSTS_PER_PAGE = 12;

export const metadata = {
  title: 'HSP 4x4 - HSP TV',
  // description: ''
};

export default async function HspTVPage() {
  const posts = await getAllHspTvPosts(1000);
  const allPosts = posts?.hspTvPosts?.nodes;
  const totalPosts = allPosts?.length;
  const content = await getPageData('lifestyle/hsp-blog');
  const contentResolved = content?.flexibleContent.blocks.map(renderBlock);

  const paginationScope = 'posts-list';

  return (
    <PaginationContextProvider>
      <Layout title="">
        <Container>
          <div className={styles.breadcrumbs}>
            <BreadcrumbsLifestyle initialContentTypeRoute={routes.tv()} />
          </div>
          {contentResolved}
          <PostsList
            variant="hsp-tv"
            posts={allPosts}
            perPage={POSTS_PER_PAGE}
            paginationScope={paginationScope}
          />
          {totalPosts > POSTS_PER_PAGE && (
            <Pagination
              perPage={POSTS_PER_PAGE}
              totalPosts={totalPosts}
              scope={paginationScope}
            />
          )}
          {/*<Newsletter />*/}
        </Container>
      </Layout>
    </PaginationContextProvider>
  );
}
