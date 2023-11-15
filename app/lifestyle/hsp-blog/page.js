import { Fragment } from 'react';

import { getAllBlogPosts, getPageData } from '@lib/api';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';
import { PaginationContextProvider } from '@contexts/pagination';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import PostsList from '@components/posts-list/posts-list';
import Pagination from '@components/pagination/pagination';
import Background from '@components/background/background';
import styles from '../page.module.scss';

const POSTS_PER_PAGE = 12;

export const metadata = {
  title: 'HSP 4x4 - HSP Blog',
  // description: ''
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts(1000);
  const allPosts = posts?.posts?.nodes;
  const totalPosts = allPosts?.length;
  const content = await getPageData('lifestyle/hsp-blog');
  const contentBlocks = content?.flexibleContent.blocks.map(renderBlock);

  const paginationScope = 'posts-list';

  const colorStops = [
    { colorStop: { color: 'black' } },
    { colorStop: { color: 'transparent' } },
  ];

  return (
    <PaginationContextProvider>
      <Layout title="">
        <Background colorStops={colorStops} containMargins>
          <Container collapseMargin>
            <div className={styles.breadcrumbs}>
              <BreadcrumbsLifestyle initialContentTypeRoute={routes.blog()} />
            </div>
          </Container>
          {contentBlocks?.map((contentBlock, index) => (
            <Fragment key={index}>{contentBlock}</Fragment>
          ))}
          <Container collapseMargin>
            <PostsList
              variant="blog"
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
          </Container>
          {/*<Newsletter />*/}
        </Background>
      </Layout>
    </PaginationContextProvider>
  );
}
