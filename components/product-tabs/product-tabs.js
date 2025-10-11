'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMobile } from '@hooks/useIsMobile';

import { scrollIntoViewHorizontally } from '@lib/helpers';

import Accordion from '@components/accordion/accordion';
import AccordionItem from '@components/accordion/accordion-item';
import DownloadFileButton from '@components/download-file-button/download-file-button';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './product-tabs.module.scss';

export default function ProductTabs({
  description,
  downloadFileFormId,
  featuresBoxes,
  featuresDescription,
  manualsDescription,
  manualsLinks,
  specificationContent,
  specificationDescription,
}) {
  const isMobile = useIsMobile();
  const headerRef = useRef(null);
  const tabs = useMemo(
    () => ({
      ...(description && {
        description: 'Description',
      }),
      ...((featuresDescription || featuresBoxes?.length > 0) && {
        features: 'Features',
      }),
      ...((specificationDescription || specificationContent) && {
        specs: 'Technical Specifications',
      }),
      ...(manualsLinks?.length > 0 && { manuals: 'Manuals' }),
    }),
    [
      description,
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

  const Description = () => (
    <>
      {description && (
        <Wysiwyg className={styles.wysiwyg} content={description} />
      )}
    </>
  );

  const FeaturesContent = () => (
    <>
      {featuresDescription && (
        <p className={clsx(styles.description, 'p-large')}>
          {featuresDescription}
        </p>
      )}
      <div className={styles.featuresContainer}>
        {featuresBoxes?.length > 0 &&
          featuresBoxes.map((feature, index) => (
            <div
              className={clsx(styles.featureItem, {
                [styles.videoFeature]: feature.video,
                [styles.imageFeature]: feature.image,
              })}
              key={feature.title + index}
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
                  {feature.title && (
                    <h4 className={styles.featureTitle}>{feature.title}</h4>
                  )}
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
  );

  const SpecsContent = () => (
    <>
      {specificationDescription && (
        <p className={clsx(styles.description, 'p-large')}>
          {specificationDescription}
        </p>
      )}
      {specificationContent && (
        <Wysiwyg className={styles.wysiwyg} content={specificationContent} />
      )}
    </>
  );

  const ManualsContent = () => (
    <>
      {manualsDescription && (
        <p className={clsx(styles.description, 'p-large')}>
          {manualsDescription}
        </p>
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
  );

  // Mobile accordion view
  const mobileContent = (
    <Accordion
      allowMultipleOpen
      className={clsx(styles.productAccordion, styles.hideOnDesktop)}
      stickyOnMobile
    >
      {tabs.description && (
        <AccordionItem
          className={styles.accordionItem}
          triggerContent={tabs.description}
        >
          <Description />
        </AccordionItem>
      )}
      {tabs.features && (
        <AccordionItem
          className={styles.accordionItem}
          triggerContent={tabs.features}
        >
          <FeaturesContent />
        </AccordionItem>
      )}
      {tabs.specs && (
        <AccordionItem
          className={styles.accordionItem}
          triggerContent={tabs.specs}
        >
          <SpecsContent />
        </AccordionItem>
      )}
      {tabs.manuals && (
        <AccordionItem
          className={styles.accordionItem}
          triggerContent={tabs.manuals}
        >
          <ManualsContent />
        </AccordionItem>
      )}
    </Accordion>
  );

  // Desktop tabs view
  const desktopContent = (
    <div className={clsx(styles.tabs, styles.hideOnMobile)}>
      <div className={styles.headers} ref={headerRef}>
        {Object.entries(tabs).map(([tabKey, tabTitle], index) => (
          <button
            className={clsx(styles.tab, 'h3', {
              [styles.activeTab]: activeTab === tabKey,
            })}
            id={tabKey}
            key={tabKey + index}
            onClick={() => setActiveTab(tabKey)}
            type="button"
          >
            {tabTitle}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {activeTab === 'description' && <Description />}
        {activeTab === 'features' && <FeaturesContent />}
        {activeTab === 'specs' && <SpecsContent />}
        {activeTab === 'manuals' && <ManualsContent />}
      </div>
    </div>
  );

  return (
    <>
      {mobileContent}
      {desktopContent}
    </>
  );
}
