'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import clsx from 'clsx';
import data from './mock-data';
import Wysiwyg from '@components/wysiwyg/wysiwyg';
import styles from './product-tabs.module.scss';

export default function ProductTabs() {
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
            {data.features.description && (
              <p className={styles.description}>{data.features.description}</p>
            )}
            <div className={styles.featuresContainer}>
              {data.features.items.length > 0 &&
                data.features.items.map(feature => (
                  <div
                    className={clsx(styles.featureItem, {
                      [styles.videoFeature]: feature.type === 'video',
                      [styles.imageFeature]: feature.type === 'image',
                    })}
                    key={feature.title}
                  >
                    <div>
                      <Image
                        className={styles.icon}
                        src={feature.icon || ''}
                        width={58}
                        height={58}
                        alt="icon"
                      />
                      <div className={styles.featureContent}>
                        {feature.title && <h5>{feature.title}</h5>}
                        <Wysiwyg
                          className={styles.wysiwyg}
                          content={feature.text}
                        />
                      </div>
                    </div>
                    {feature.mediaUrl && feature.type === 'video' && (
                      <video
                        className={styles.video}
                        width="230"
                        height="443"
                        autoPlay
                        muted
                      >
                        <source src={feature.mediaUrl || ''} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {feature.mediaUrl && feature.type === 'image' && (
                      <Image
                        className={styles.image}
                        src={feature.mediaUrl || ''}
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
            {data.specifications.description && (
              <p className={styles.description}>
                {data.specifications.description}
              </p>
            )}
            {data.specifications.content && (
              <Wysiwyg
                className={styles.wysiwyg}
                content={data.specifications.content}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
