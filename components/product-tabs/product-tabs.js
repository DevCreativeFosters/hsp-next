'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import { scrollIntoViewHorizontally } from '@lib/helpers';
import DownloadFileButton from '@components/download-file-button/download-file-button';
import styles from './product-tabs.module.scss';

const DEFAULT_TAB = 'features';

export default function ProductTabs({
  featuresDescription,
  featuresBoxes,
  specificationDescription,
  specificationContent,
  manualsDescription,
  manualsLinks,
  downloadFileFormId,
}) {
  const headerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const tabs = {
    ...((featuresDescription || featuresBoxes?.length > 0) && {
      features: 'Features',
    }),
    ...((specificationDescription || specificationContent) && {
      specs: 'Technical Specifications',
    }),
    ...(manualsLinks?.length > 0 && { manuals: 'Manuals' }),
  };

  useEffect(
    function scrollActiveTabButtonIntoView() {
      const activeTabButton = document.getElementById(activeTab);

      scrollIntoViewHorizontally(headerRef.current, activeTabButton, 24);
    },
    [activeTab],
  );

  return (
    <div className={styles.tabs}>
      <div className={styles.headers} ref={headerRef}>
        {Object.entries(tabs).map(([tabKey, tabTitle]) => (
          <button
            id={tabKey}
            key={tabKey}
            className={clsx(styles.tab, {
              [styles.activeTab]: activeTab === tabKey,
            })}
            type="button"
            onClick={() => setActiveTab(tabKey)}
          >
            {tabTitle}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {activeTab === 'features' && (
          <>
            {featuresDescription && (
              <p className={styles.description}>{featuresDescription}</p>
            )}
            <div className={styles.featuresContainer}>
              {featuresBoxes?.length > 0 &&
                featuresBoxes.map(feature => (
                  <div
                    className={clsx(styles.featureItem, {
                      [styles.videoFeature]: feature.video,
                      [styles.imageFeature]: feature.image,
                    })}
                    key={feature.title}
                  >
                    <div>
                      {feature.icon && (
                        <Image
                          className={styles.icon}
                          src={feature.icon.mediaItemUrl || ''}
                          width={58}
                          height={58}
                          alt="icon"
                        />
                      )}
                      <div className={styles.featureContent}>
                        {feature.title && <h5>{feature.title}</h5>}
                        <Wysiwyg
                          className={styles.wysiwyg}
                          content={feature.content}
                        />
                      </div>
                    </div>
                    {feature.video && (
                      <video
                        className={styles.video}
                        width="230"
                        height="443"
                        autoPlay
                        muted
                      >
                        <source
                          src={feature.video.mediaItemUrl || ''}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {feature.image && (
                      <Image
                        className={styles.image}
                        src={feature.image.mediaItemUrl || ''}
                        width={636}
                        height={166}
                        alt=""
                      />
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
        {activeTab === 'specs' && (
          <>
            {specificationDescription && (
              <p className={styles.description}>{specificationDescription}</p>
            )}
            {specificationContent && (
              <Wysiwyg
                className={styles.wysiwyg}
                content={specificationContent}
              />
            )}
          </>
        )}
        {activeTab === 'manuals' && (
          <>
            {manualsDescription && (
              <p className={styles.description}>{manualsDescription}</p>
            )}
            <div className={styles.manualsContainer}>
              {manualsLinks.map(({ url, label }, index) => {
                if (!url) return null;
                return (
                  <DownloadFileButton
                    key={`${url}-${index}`}
                    href={url}
                    download
                    variant="quinary"
                    rightIcon="download"
                    shortenable
                    downloadFileFormId={downloadFileFormId}
                  >
                    {label}
                  </DownloadFileButton>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
