'use client';

import { useRef } from 'react';
import clsx from 'clsx';
import routes from '@lib/routes';
import RelatedPosts from '@components/related-posts/related-posts';
import Container from '@components/container/container';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import VideoContainer from '@components/video-container/video-container';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import styles from './hsp-tv-post.module.scss';

export function HspTvPost({
  relatedPosts,
  title,
  content,
  slug,
  customFields,
}) {
  const informationRef = useRef(null);

  return (
    <Container>
      <div className={styles.breadcrumbs}>
        <BreadcrumbsLifestyle
          initialContentTypeRoute={routes.tv()}
          exactBreadcrumb={{
            label: title,
            url: routes.tv(slug),
            strong: true,
          }}
        />
      </div>
      <div className={styles.header}>
        {title && (
          <div className={styles.headerIntroduction}>
            <h1 className={styles.title}>{title}</h1>
            {customFields?.description && (
              <p className={styles.description}>{customFields?.description}</p>
            )}
          </div>
        )}
        {customFields.videoId && customFields?.backgroundVideo && (
          <VideoContainer youtubeId={customFields.videoId} />
        )}
      </div>
      <div className={styles.post}>
        <div ref={informationRef} className={styles.information}>
          <div className={styles.relatedPostsContainer}>
            <RelatedPosts
              posts={relatedPosts}
              type="hsp-tv"
              url={routes.tv()}
            />
          </div>
        </div>
        <div className={styles.contentContainer}>
          {content && <Wysiwyg className={styles.content} content={content} />}
        </div>
      </div>
    </Container>
  );
}
