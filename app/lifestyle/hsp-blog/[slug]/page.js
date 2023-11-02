import routes from '@lib/routes';
import Image from 'next/image';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import RelatedPosts from '@components/related-posts/related-posts';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import { getBlogPost, getBlogPosts } from '@lib/api';

import styles from './page.module.scss';

const NUMBER_OF_RELATED_POSTS = 5;

export default async function BlogPost({ params }) {
  const post = await getBlogPost(params.slug);
  const title = post?.title;
  const content = post?.content;
  const excerpt = post?.excerpt;
  const image = post?.featuredImage?.node;
  const slug = post?.uri?.replaceAll('/', '');

  const relatedPosts = await getBlogPosts(NUMBER_OF_RELATED_POSTS);

  return (
    <Layout title={`HSP 4x4 - ${title}`}>
      <Container>
        <div className={styles.post}>
          <BreadcrumbsLifestyle
            initialContentTypeRoute={routes.blog()}
            exactBreadcrumb={{
              label: title,
              url: routes.blog(slug),
              strong: true,
            }}
          />
          {image && (
            <div className={styles.featuredImageContainer}>
              <Image
                className={styles.featuredImage}
                src={image?.sourceUrl}
                fill={true}
                alt={image?.altText}
              />
            </div>
          )}
          <div className={styles.information}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {excerpt && (
              <div
                className={styles.excerpt}
                dangerouslySetInnerHTML={{ __html: excerpt }}
              />
            )}
            <div className={styles.relatedPostsContainer}>
              <RelatedPosts
                posts={relatedPosts}
                type="blog"
                url={routes.blog()}
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
