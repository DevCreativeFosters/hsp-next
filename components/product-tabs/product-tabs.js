'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { scrollIntoViewHorizontally } from '@lib/helpers';

import DownloadFileButton from '@components/download-file-button/download-file-button';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './product-tabs.module.scss';

export default function ProductTabs({
  downloadFileFormId,
  featuresBoxes,
  featuresDescription,
  manualsDescription,
  manualsLinks,
  specificationContent,
  specificationDescription,
}) {
  const headerRef = useRef(null);
  const tabs = useMemo(
    () => ({
      ...((featuresDescription || featuresBoxes?.length > 0) && {
        features: 'Features',
      }),
      ...((specificationDescription || specificationContent) && {
        specs: 'Technical Specifications',
      }),
      ...(manualsLinks?.length > 0 && { manuals: 'Manuals' }),
    }),
    [
      featuresBoxes,
      featuresDescription,
      manualsLinks,
      specificationContent,
      specificationDescription,
    ],
  );

  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);

  useEffect(() => {
    setActiveTab(Object.keys(tabs)[0]);
  }, [tabs]);

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
            className={clsx(styles.tab, {
              [styles.activeTab]: activeTab === tabKey,
            })}
            id={tabKey}
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            type="button"
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
                          alt="icon"
                          className={styles.icon}
                          height={58}
                          src={feature.icon.node?.mediaItemUrl || ''}
                          width={58}
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
                        autoPlay
                        className={styles.video}
                        height="443"
                        muted
                        width="230"
                      >
                        <source
                          src={feature.video?.node?.mediaItemUrl || ''}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {feature.image && (
                      <Image
                        alt=""
                        className={styles.image}
                        height={166}
                        src={feature.image?.node?.mediaItemUrl || ''}
                        width={636}
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
              {manualsLinks.map(({ label, url }, index) => {
                if (!url) return null;
                return (
                  <DownloadFileButton
                    download
                    downloadFileFormId={downloadFileFormId}
                    href={url}
                    key={`${url}-${index}`}
                    rightIcon="download"
                    shortenable
                    variant="quinary"
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
