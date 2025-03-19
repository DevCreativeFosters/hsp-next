'use client';

import { useRef } from 'react';

import clsx from 'clsx';

import routes from '@lib/routes';

import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Container from '@components/container/container';
import RelatedPosts from '@components/related-posts/related-posts';
import VideoContainer from '@components/video-container/video-container';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './hsp-tv-post.module.scss';

export function HspTvPost({
  content,
  customFields,
  relatedPosts,
  slug,
  title,
}) {
  const informationRef = useRef(null);

  return (
    <Container className={styles.container}>
      <div className={styles.breadcrumbs}>
        <BreadcrumbsLifestyle
          exactBreadcrumb={{
            label: title,
            strong: true,
            url: routes.tv(slug),
          }}
          initialContentTypeRoute={routes.tv()}
        />
      </div>
      <div className={styles.video}>
        {customFields?.videoId && customFields?.backgroundVideo && (
          <VideoContainer youtubeId={customFields.videoId} />
        )}
      </div>
      <div className={styles.post}>
        <div className={styles.information} ref={informationRef}>
          {title && <h1 className={clsx(styles.title, 'h2')}>{title}</h1>}
          <div className={styles.relatedPostsContainer}>
            <RelatedPosts
              posts={relatedPosts}
              type="hsp-tv"
              url={routes.tv()}
            />
          </div>
        </div>
        <div className={styles.contentContainer}>
          {customFields?.description && (
            <div
              className={clsx(styles.description, 'p-large')}
              dangerouslySetInnerHTML={{ __html: customFields?.description }}
            />
          )}
          {content && <Wysiwyg className={styles.content} content={content} />}
        </div>
      </div>
    </Container>
  );
}
