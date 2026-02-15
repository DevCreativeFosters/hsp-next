'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import TileCarousel from '@components/tile-carousel/tile-carousel';

import styles from './product-image-carousel.module.scss';

export default function ProductImageCarousel({
  imageTagDesktop,
  imageTagMobile,
  images,
  minImagesForNav = 4,
  modalService = false,
  showMainImage = true,
}) {
  const buttonPrevRef = useRef();
  const buttonNextRef = useRef();

  const isMobile = useIsMobile();

  const [mounted, setMounted] = useState(false);

  const [selectedImage, setSelectedImage] = useState(
    images?.length ? images[0] : null,
  );

  const [imageIndex, setImageIndex] = useState(0);

  const mainImageContainerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleThumbnailClick = useCallback(
    selectedImageUrl => {
      setSelectedImage(selectedImageUrl);
      const index = images.findIndex(
        image => image.sourceUrl === selectedImageUrl.sourceUrl,
      );
      setImageIndex(index);

      if (modalService) openModal();
    },
    [images],
  );

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [closeModal, isModalOpen]);

  const isNavigationVisible = images?.length > minImagesForNav;

  const itemTpl = useMemo(() => {
    const itemTemplate = item => (
      <div className={styles.thumbnailWrapper}>
        <Image
          alt={item.alt}
          className={clsx(styles.thumbnail, {
            [styles.active]:
              selectedImage && selectedImage.sourceUrl === item.sourceUrl,
          })}
          height={141}
          onClick={() => handleThumbnailClick(item)}
          src={item.sourceUrl}
          width={141}
        />
      </div>
    );

    return itemTemplate;
  }, [handleThumbnailClick, selectedImage]);

  const changeSlide = useCallback(
    direction => () => {
      const newSlideIndex = imageIndex + direction;
      if (newSlideIndex >= 0 && newSlideIndex < images.length) {
        setImageIndex(newSlideIndex);
        setSelectedImage(images[newSlideIndex]);
      }
    },
    [imageIndex, images],
  );

  return (
    <div className={styles.container}>
      {showMainImage && (
        <div className={styles.mainImageContainer} ref={mainImageContainerRef}>
          {(imageTagMobile?.sourceUrl || imageTagDesktop?.sourceUrl) && (
            <Image
              alt={
                (isMobile
                  ? imageTagMobile?.altText
                  : imageTagDesktop?.altText) || ''
              }
              className={styles.overlayImage}
              height={
                isMobile
                  ? imageTagMobile?.mediaDetails?.height
                  : imageTagDesktop?.mediaDetails?.height
              }
              src={
                isMobile
                  ? imageTagMobile?.sourceUrl
                  : imageTagDesktop?.sourceUrl
              }
              width={
                isMobile
                  ? imageTagMobile?.mediaDetails?.width
                  : imageTagDesktop?.mediaDetails?.width
              }
            />
          )}
          {selectedImage && (
            <Image
              alt={selectedImage.alt}
              className={styles.mainImage}
              fill
              src={selectedImage.sourceUrl}
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
      )}
      <TileCarousel
        buttonNextRef={buttonNextRef}
        buttonPrevRef={buttonPrevRef}
        containerClassName={styles.thumbnailCarouselContainer}
        id="product-gallery"
        itemTemplate={itemTpl}
        items={images}
        name="Product image carousel"
        nonOverflowWrapper
        resetStyle
        xSmallGaps
      >
        {isNavigationVisible && images.length && (
          <>
            <Button
              background="dark"
              className={clsx(
                'navigationButton',
                styles.navigationButton,
                styles.prevButton,
              )}
              onClick={changeSlide(-1)}
              ref={buttonPrevRef}
              rightIcon="arrow-previous"
              variant="secondary"
            />
            <Button
              background="dark"
              className={clsx(
                'navigationButton',
                styles.navigationButton,
                styles.nextButton,
              )}
              onClick={changeSlide(1)}
              ref={buttonNextRef}
              rightIcon="arrow-next"
              variant="secondary"
            />
          </>
        )}
      </TileCarousel>

      {mounted &&
        createPortal(
          <div
            className={clsx(styles.modalOverlay, {
              [styles.show]: isModalOpen,
            })}
            onClick={closeModal}
          >
            <div
              className={styles.modalContent}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={closeModal}>
                ×
              </button>
              {selectedImage && (
                <Image
                  alt={selectedImage.alt}
                  height={1200}
                  src={selectedImage.sourceUrl}
                  style={{ objectFit: 'contain' }}
                  width={1200}
                />
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
