'use client';

import { useEffect, useRef, useState } from 'react';

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
  const accordionRef = useRef(null);
  const [accordionHeight, setAccordionHeight] = useState(0);

  useEffect(() => {
    if (accordionRef.current) {
      const height = accordionRef.current.clientHeight;
      setAccordionHeight(height);
    }
  }, [accordions, isMediumWidth, isMobile]);

  return (
    <Container className={styles.container} collapseMargin>
      {accordions && accordions.length > 0 && (
        <div ref={accordionRef}>
          <Accordion
            alwaysOpen={true}
            className={styles.accordion}
            openFirstByDefault={true}
          >
            {accordions.map(
              (accordion, index) =>
                accordion.accordionTitle && (
                  <AccordionItem
                    className={styles.item}
                    key={index}
                    triggerContent={accordion.accordionTitle}
                  >
                    {accordion.accordionDescription && (
                      <TextElement
                        className={styles.description}
                        text={accordion.accordionDescription}
                      />
                    )}
                    <div className={styles.media}>
                      {accordion.media === 'image' && accordion.image && (
                        <Image
                          alt={accordion.image?.node?.altText || ''}
                          className={styles.image}
                          height={isMobile ? 198 : isMediumWidth ? 285 : 571}
                          src={accordion.image?.node?.sourceUrl}
                          style={{ maxHeight: `${accordionHeight}px` }}
                          width={isMobile ? 278 : isMediumWidth ? 400 : 800}
                        />
                      )}
                      {accordion.media === 'video' && accordion.videoFile && (
                        <div
                          className={styles.video}
                          style={{ maxHeight: `${accordionHeight}px` }}
                        >
                          <VideoCard
                            url={accordion.videoFile?.node?.mediaItemUrl}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionItem>
                ),
            )}
          </Accordion>
        </div>
      )}
    </Container>
  );
}
