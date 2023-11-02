import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import RelatedPosts from '@components/related-posts/related-posts';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import routes from '@lib/routes';
import { getHspTvPost, getHspTvPosts } from '@lib/api';

import styles from './page.module.scss';
import VideoIframe from '@components/video-iframe/video-iframe';

const NUMBER_OF_RELATED_POSTS = 5;

export default async function HspTVPost({ params }) {
  const post = await getHspTvPost(params.slug);
  const title = post?.title;
  const content = post?.content;
  const slug = post?.uri?.replaceAll('/', '');
  const customFields = post?.hspTvPostCustomFields;

  const relatedPosts = await getHspTvPosts(NUMBER_OF_RELATED_POSTS);

  return (
    <Layout title={`HSP 4x4 - ${title}`}>
      <Container>
        <BreadcrumbsLifestyle
          initialContentTypeRoute={routes.tv()}
          exactBreadcrumb={{
            label: title,
            url: routes.tv(slug),
            strong: true,
          }}
        />
        {title && <h1 className={styles.title}>{title}</h1>}
        {customFields?.description && (
          <p className={styles.description}>{customFields?.description}</p>
        )}
        {customFields?.videoUrl && (
          <VideoIframe
            src={customFields?.videoUrl}
            desktopWidth={1320}
            desktopHeight={742}
            mobileWidth={342}
            mobileHeight={293}
          />
        )}
        <div className={styles.post}>
          <div className={styles.information}>
            <div className={styles.relatedPostsContainer}>
              <RelatedPosts
                posts={relatedPosts}
                type="blog"
                url={routes.tv()}
              />
            </div>
          </div>
          <div className={styles.contentContainer}>
            {content && (
              <Wysiwyg className={styles.content} content={content} />
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
