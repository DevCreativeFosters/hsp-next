'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMobile } from '@hooks/useIsMobile';

import { scrollIntoViewHorizontally } from '@lib/helpers';

import Accordion from '@components/accordion/accordion';
import AccordionItem from '@components/accordion/accordion-item';
import Button from '@components/button/button';
import DownloadFileButton from '@components/download-file-button/download-file-button';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import RatingStar from '@assets/icons/rating-star.svg';

import styles from './product-tabs.module.scss';

export default function ProductTabs({
  description,
  downloadFileFormId,
  featuresBoxes,
  featuresDescription,
  manualsDescription,
  manualsLinks,
  productName,
  reviews,
  specificationContent,
  specificationDescription,
}) {
  const isMobile = useIsMobile();
  const headerRef = useRef(null);

  // const [rating, setRating] = useState(0);
  // const [hover, setHover] = useState(0);

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
      reviews: 'Reviews',
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

      if (activeTabButton) {
        scrollIntoViewHorizontally(headerRef.current, activeTabButton, 24);
      }
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

  const ReviewsContent = () => (
    <div className={styles.reviewsWrapper}>
      <div className={styles.reviewWrap}>
        <div className={styles.heading}>
          <Button size="large" variant="primary">
            Leave A Review
          </Button>
          <select>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/*
        <div className={styles.reviewForm}>
          <h2>Leave A Review</h2>

          <div className={styles.colFull}>
            <div className={styles.inputGroup}>
              <label>How Would You rate us ? <span className={styles.reqStar}>*</span></label>
              <div className={styles.starRatingContainer}>
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    className={clsx(styles.starButton, {
                      [styles.filled]: (hover || rating) >= starValue,
                    })}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <RatingStar />
                  </button>
                ))}
              </div>
              <input type="hidden" name="rating" value={rating} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.colHalf}>
              <div className={styles.inputGroup}>
                <label>Name<span className={styles.reqStar}>*</span></label>
                <input
                  name="first_name"
                  type="text"
                />
              </div>
            </div>
            <div className={styles.colHalf}>
              <div className={styles.inputGroup}>
                <label>Email<span className={styles.reqStar}>*</span></label>
                <input
                  name="email"
                  type="text"
                />
              </div>
            </div>
            <div className={styles.colFull}>
              <div className={styles.inputGroup}>
                <label>Upload Image<span className={styles.reqStar}>*</span></label>
                <input
                  name="upload_image"
                  type="file"
                />
              </div>
            </div>
            <div className={styles.colFull}>
              <div className={styles.inputGroup}>
                <label>Comment<span className={styles.reqStar}>*</span></label>
                <textarea></textarea>
              </div>
            </div>
            <div className={clsx(styles.colFull, styles.submitBtn)}>
              <div className={styles.inputGroup}>
                <Button variant="primary" size="large">Submit Review</Button>
              </div>
            </div>
          </div>
        </div>
        */}

        <div className={styles.reviewLists}>
          {reviews.map(review => {
            const author = review?.author?.node;
            const img = review?.reviewUploadImage?.uploadImage?.node;

            return (
              <div className={styles.reviewBox} key={review.databaseId}>
                <div className={styles.left}>
                  <div className={styles.ratingStars}>
                    {Array.from({ length: review?.rating }, (_, i) => (
                      <RatingStar key={i} />
                    ))}
                  </div>
                  <div
                    className={styles.desc}
                    dangerouslySetInnerHTML={{ __html: review.content }}
                  ></div>
                  <div className={styles.reviewAuthor}>
                    <p>
                      <strong>{author?.name}</strong>
                    </p>
                    <span>Ordered the HSP {productName}</span>
                  </div>
                </div>
                {img && (
                  <div className={styles.right}>
                    <figure>
                      <Image
                        alt={img.altText}
                        height={160}
                        src={img.sourceUrl}
                        width={250}
                      />
                    </figure>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

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
      <AccordionItem
        className={styles.accordionItem}
        triggerContent={tabs.reviews}
      >
        <ReviewsContent />
      </AccordionItem>
    </Accordion>
  );

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
        {activeTab === 'reviews' && <ReviewsContent />}
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
