'use client';

import { useEffect, useRef } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Accordion from '@components/accordion/accordion';
import AccordionItem from '@components/accordion/accordion-item';
import Container from '@components/container/container';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './accordion-facts.module.scss';

export default function AccordionFacts({ accordions, background }) {
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();
  const mediaWrapperRefs = useRef([]);
  const mediaRefs = useRef([]);

  const updateMediaHeight = index => {
    const mediaWrapper = mediaWrapperRefs.current[index];
    const media = mediaRefs.current[index];
    if (mediaWrapper && media) {
      if (!isMobile && !isMediumWidth) {
        media.style.height = `${mediaWrapper.offsetHeight}px`;
      } else {
        media.style.height = 'auto';
      }
    }
  };

  useEffect(() => {
    mediaWrapperRefs.current.forEach((_, index) => updateMediaHeight(index));

    // Set up event listeners to update heights when accordions change
    const accordionItems = document.querySelectorAll(`.${styles.item}`);
    accordionItems.forEach((item, index) => {
      item.addEventListener('transitionend', () => updateMediaHeight(index));
    });

    // Cleanup listeners on unmount
    return () => {
      accordionItems.forEach((item, index) => {
        item.removeEventListener('transitionend', () =>
          updateMediaHeight(index),
        );
      });
    };
  }, [accordions, isMediumWidth, isMobile, updateMediaHeight]);

  return (
    <Container className={styles.container}>
      {accordions && accordions.length > 0 && (
        <div>
          <Accordion
            className={styles.accordion}
            keepOneOpen={true}
            openFirstByDefault={true}
          >
            {accordions.map((accordion, index) =>
              accordion.accordionTitle ? (
                <AccordionItem
                  className={styles.item}
                  key={index}
                  triggerContent={accordion.accordionTitle}
                >
                  {accordion.accordionDescription && (
                    <TextElement
                      className={clsx(styles.description, 'p-medium')}
                      text={accordion.accordionDescription}
                    />
                  )}
                  <div
                    className={styles.mediaWrapper}
                    ref={el => (mediaWrapperRefs.current[index] = el)}
                  >
                    <div
                      className={styles.media}
                      ref={el => (mediaRefs.current[index] = el)}
                    >
                      {accordion.media === 'image' && accordion.image && (
                        <Image
                          alt={accordion.image?.node?.altText || ''}
                          className={styles.image}
                          height={isMobile ? 198 : 571}
                          src={accordion.image?.node?.sourceUrl}
                          width={isMobile ? 278 : 800}
                        />
                      )}
                      {accordion.media === 'video' && accordion.videoFile && (
                        <div className={styles.videoWrapper}>
                          <VideoCard
                            className={styles.video}
                            url={accordion.videoFile?.node?.mediaItemUrl}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionItem>
              ) : null,
            )}
          </Accordion>
        </div>
      )}
    </Container>
  );
}
