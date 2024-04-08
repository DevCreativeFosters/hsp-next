import { Fragment } from 'react';

import { getBlogPosts } from '@lib/api/get-blog-posts';
import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';

import Background from '@components/background/background';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Pagination from '@components/pagination/pagination';
import PostsList from '@components/posts-list/posts-list';
import SectionIntro from '@components/section-intro/section-intro';

import styles from '../page.module.scss';

const POSTS_PER_PAGE = 12;

export const metadata = {
  title: 'HSP 4x4 - HSP Blog',
  // description: ''
};

export default async function BlogPage({ searchParams }) {
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const postsResponse = await getBlogPosts(POSTS_PER_PAGE, offset);
  const posts = postsResponse?.posts.nodes || [];
  const totalPosts = postsResponse?.posts.pageInfo.offsetPagination.total || 0;
  const content = await getPageData('lifestyle/hsp-blog');
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);

  const colorStops = [
    { colorStop: { color: 'black' } },
    { colorStop: { color: 'transparent' } },
  ];

  return (
    <Layout title="">
      <Background colorStops={colorStops} containMargins>
        <Container collapseMargin>
          <div className={styles.breadcrumbs}>
            <BreadcrumbsLifestyle initialContentTypeRoute={routes.blog()} />
          </div>
          <SectionIntro
            title={content?.title}
            description={content?.content}
            fitInline
          />
        </Container>
        {contentBlocks?.map((contentBlock, index) => (
          <Fragment key={index}>{contentBlock}</Fragment>
        ))}
        <Container collapseMargin>
          <PostsList variant="blog" posts={posts} currentPage={currentPage} />
          {totalPosts > POSTS_PER_PAGE && (
            <Pagination
              perPage={POSTS_PER_PAGE}
              total={totalPosts}
              current={currentPage}
              urlBase={routes.blog()}
            />
          )}
        </Container>
      </Background>
    </Layout>
  );
}
