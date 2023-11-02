'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import clsx from 'clsx';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import styles from './product-tabs.module.scss';

export default function ProductTabs({
  featuresDescription,
  featuresBoxes,
  specificationDescription,
  specificationContent,
}) {
  const [activeTab, setActiveTab] = useState('features');

  const handleTabClick = useCallback(tab => {
    setActiveTab(tab);
  }, []);

  return (
    <div className={styles.tabs}>
      <div className={styles.headers}>
        <div
          className={clsx(styles.tab, {
            [styles.activeTab]: activeTab === 'features',
          })}
          onClick={() => handleTabClick('features')}
        >
          Features
        </div>
        <div
          className={clsx(styles.tab, {
            [styles.activeTab]: activeTab === 'technical-specifications',
          })}
          onClick={() => handleTabClick('technical-specifications')}
        >
          Technical Specifications
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === 'features' && (
          <>
            {featuresDescription && (
              <p className={styles.description}>{featuresDescription}</p>
            )}
            <div className={styles.featuresContainer}>
              {featuresBoxes.length > 0 &&
                featuresBoxes.map(feature => (
                  <div
                    className={clsx(styles.featureItem, {
                      [styles.videoFeature]: feature.video,
                      [styles.imageFeature]: feature.image,
                    })}
                    key={feature.title}
                  >
                    <div>
                      <Image
                        className={styles.icon}
                        src={feature.icon.mediaItemUrl || ''}
                        width={58}
                        height={58}
                        alt="icon"
                      />
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
        {activeTab === 'technical-specifications' && (
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
      </div>
    </div>
  );
}
