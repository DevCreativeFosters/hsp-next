'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import routes from '@lib/routes';
import RelatedPosts from '@components/related-posts/related-posts';
import Container from '@components/container/container';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import VideoIframe from '@components/video-iframe/video-iframe';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import styles from './hsp-tv-post.module.scss';
import PostSidebar from '@components/post-sidebar';

export function HspTvPost({
  relatedPosts,
  title,
  content,
  slug,
  customFields,
}) {
  const [isSticky, setIsSticky] = useState(false);
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
        {customFields?.videoUrl && (
          <VideoIframe
            src={customFields?.videoUrl}
            desktopWidth={1320}
            desktopHeight={742}
            mobileWidth={342}
            mobileHeight={293}
          />
        )}
      </div>
      <div className={styles.post}>
        <div
          ref={informationRef}
          className={styles.information}
          style={{ gridArea: isSticky ? 'unset' : 'infoArea' }}
        >
          <PostSidebar elementRef={informationRef} setIsSticky={setIsSticky}>
            <div
              className={clsx(styles.relatedPostsContainer, {
                [styles.relatedPostsContainerSticky]: isSticky,
              })}
            >
              {isSticky && (
                <>
                  <BreadcrumbsLifestyle
                    initialContentTypeRoute={routes.tv()}
                    exactBreadcrumb={{
                      label: title,
                      url: routes.tv(slug),
                      strong: true,
                    }}
                  />
                  <h1 className={clsx(styles.title, styles.stickyTitle)}>
                    {title}
                  </h1>
                </>
              )}
              <RelatedPosts
                posts={relatedPosts}
                type="hsp-tv"
                url={routes.tv()}
              />
            </div>
          </PostSidebar>
        </div>
        <div className={styles.contentContainer}>
          {content && <Wysiwyg className={styles.content} content={content} />}
        </div>
      </div>
    </Container>
  );
}
