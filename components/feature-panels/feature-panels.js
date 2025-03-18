'use client';

import { useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './feature-panels.module.scss';

export default function FeaturePanels({
  alignment,
  panels,
  title,
  titleTag,
  titleTagStyle,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();

  return (
    <Container className={styles.container}>
      {title && (
        <DynamicTitle
          className={clsx(styles.title, styles[alignment] || styles.left)}
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          <div dangerouslySetInnerHTML={{ __html: title }} />
        </DynamicTitle>
      )}

      {panels && panels.length > 0 && (
        <div className={styles.panels}>
          {panels.map((panel, index) => (
            <button
              aria-selected={activeTab === index}
              className={clsx(styles.panel, {
                [styles.isActive]: activeTab === index,
              })}
              key={index}
              onClick={() => setActiveTab(index)}
              role="tab"
            >
              <DynamicTitle
                className={clsx(styles.panelTitle, 'h3')}
                defaultTag="p"
                titleTag={panel.titleTag}
                titleTagStyle={panel.titleTagStyle}
              >
                {panel.label}
              </DynamicTitle>
            </button>
          ))}
        </div>
      )}

      {panels && panels.length > 0 && (
        <div className={styles.content}>
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
              <div className={styles.video}>
                <VideoCard
                  url={panels[activeTab].videoFile?.node?.mediaItemUrl}
                />
              </div>
            )}
          {panels[activeTab].description && (
            <TextElement
              className={styles.description}
              text={panels[activeTab].description}
            />
          )}
        </div>
      )}
    </Container>
  );
}
