'use client';

import { useRef } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import routes from '@lib/routes';

import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Container from '@components/container/container';
import RelatedPosts from '@components/related-posts/related-posts';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './blog-post.module.scss';

export function BlogPost({
  content,
  excerpt,
  image,
  relatedPosts,
  slug,
  title,
}) {
  const informationRef = useRef(null);

  return (
    <Container>
      <div className={styles.post}>
        <div className={styles.contentArea}>
          <div className={styles.breadcrumbsMobile}>
            <BreadcrumbsLifestyle
              exactBreadcrumb={{
                label: title,
                strong: true,
                url: routes.blog(slug),
              }}
              initialContentTypeRoute={routes.blog()}
            />
          </div>
          {image && (
            <div className={styles.featuredImageContainer}>
              <Image
                alt={image?.altText}
                className={styles.featuredImage}
                fill={true}
                src={image?.sourceUrl}
              />
            </div>
          )}
          <div className={styles.headerInfo}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {excerpt && (
              <div
                className={clsx(styles.excerpt, 'p-large')}
                dangerouslySetInnerHTML={{ __html: excerpt }}
              />
            )}
          </div>
          <div className={styles.contentContainer}>
            {content && (
              <Wysiwyg className={styles.content} content={content} />
            )}
          </div>
        </div>
        <div className={styles.information} ref={informationRef}>
          <BreadcrumbsLifestyle
            exactBreadcrumb={{
              label: title,
              strong: true,
              url: routes.blog(slug),
            }}
            initialContentTypeRoute={routes.blog()}
          />
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
      </div>
    </Container>
  );
}
