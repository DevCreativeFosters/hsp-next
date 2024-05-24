'use client';

import { useRef } from 'react';

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
    <Container>
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
      <div className={styles.header}>
        {title && (
          <div className={styles.headerIntroduction}>
            <h1 className={styles.title}>{title}</h1>
            {customFields?.description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: customFields?.description }}
              />
            )}
          </div>
        )}
        {customFields?.videoId && customFields?.backgroundVideo && (
          <VideoContainer youtubeId={customFields.videoId} />
        )}
      </div>
      <div className={styles.post}>
        <div className={styles.information} ref={informationRef}>
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
