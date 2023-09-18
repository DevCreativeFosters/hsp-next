import {
  getAllBlogPosts,
  getMenus,
  getGlobalOptions,
  getPageData,
  getNumberOfPosts,
} from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import PostsList from '@components/posts-list/posts-list';
import Pagination from '@components/pagination/pagination';
import { PaginationContextProvider } from '@contexts/pagination';
import routes from '@lib/routes';

const POSTS_PER_PAGE = 12;

export const metadata = {
  title: 'HSP 4x4 - HSP Blog',
  // description: ''
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts(1, POSTS_PER_PAGE);
  const initialPosts = posts?.posts?.nodes;
  const totalPosts = await getNumberOfPosts();
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const content = await getPageData('lifestyle/hsp-blog');
  const contentResolved = await Promise.all(content?.map(renderBlock));

  const paginationScope = 'posts-list';

  return (
    <PaginationContextProvider>
      <Layout title="" menus={menus} globalOptions={globalOptions}>
        <Container>
          <BreadcrumbsLifestyle initialContentTypeRoute={routes.blog()} />
          {contentResolved}
          <PostsList
            variant="blog"
            initialPosts={initialPosts}
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
