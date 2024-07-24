'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Container from '@components/container/container';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './feature-panels.module.scss';

export default function FeaturePanels({ panels, title }) {
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();

  return (
    <Container collapseMargin>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}

        <div className={styles.panels}>
          {panels.map((panel, index) => (
            <button
              aria-selected={activeTab === index}
              className={`${styles.panel} ${
                activeTab === index ? styles.isActive : ''
              }`}
              key={index}
              onClick={() => setActiveTab(index)}
              role="tab"
            >
              {panel.label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {panels[activeTab].media === 'image' && panels[activeTab].image && (
            <Image
              alt={panels[activeTab].image?.node?.altText || ''}
              className={styles.image}
              height={isMobile ? 194 : isMediumWidth ? 319 : 639}
              src={panels[activeTab].image?.node?.sourceUrl}
              width={isMobile ? 342 : isMediumWidth ? 564 : 1128}
            />
          )}
          {panels[activeTab].media === 'video' &&
            panels[activeTab].videoFile && (
              <VideoCard
                url={panels[activeTab].videoFile?.node?.mediaItemUrl}
              />
            )}

          {panels[activeTab].title && (
            <h3 className={styles.tabTitle}>{panels[activeTab].title}</h3>
          )}
          {panels[activeTab].subtitle && (
            <h4 className={styles.tabSubtitle}>{panels[activeTab].subtitle}</h4>
          )}
          <TextElement
            className={styles.tabDescription}
            text={panels[activeTab].description}
          />
        </div>
      </div>
    </Container>
  );
}
