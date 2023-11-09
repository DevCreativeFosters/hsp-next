'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import routes from '@lib/routes';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Container from '@components/container/container';
import RelatedPosts from '@components/related-posts/related-posts';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import styles from './blog-post.module.scss';
import PostSidebar from '@components/post-sidebar';

export function BlogPost({
  title,
  content,
  excerpt,
  image,
  slug,
  relatedPosts,
}) {
  const [isSticky, setIsSticky] = useState(false);
  const informationRef = useRef(null);

  return (
    <Container>
      <div className={styles.post}>
        <div className={styles.contentArea}>
          <BreadcrumbsLifestyle
            className={styles.breadcrumbsMobile}
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
          <div className={styles.headerInfo}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {excerpt && (
              <div
                className={styles.excerpt}
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
        <div
          ref={informationRef}
          className={clsx(styles.information, {
            [styles.stickySidebar]: isSticky,
          })}
        >
          <PostSidebar elementRef={informationRef} setIsSticky={setIsSticky}>
            <BreadcrumbsLifestyle
              initialContentTypeRoute={routes.blog()}
              exactBreadcrumb={{
                label: title,
                url: routes.blog(slug),
                strong: true,
              }}
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
          </PostSidebar>
        </div>
      </div>
    </Container>
  );
}
