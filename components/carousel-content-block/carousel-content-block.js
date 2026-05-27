'use client';

import Carousel from '@components/carousel/carousel';
import Container from '@components/container/container';

import styles from './carousel-content-block.module.scss';

// Renders the "Carousel Flexible Content Block" page-builder layout:
// a Title + WYSIWYG Description + an image slider ("See It For Real").
export default function CarouselContentBlock({
  description,
  images = [],
  title,
}) {
  if (!title && !description && images.length === 0) return null;

  const slides = images.map((img, index) => (
    <div className={styles.slide} key={index}>
      <img alt={img?.altText || ''} loading="lazy" src={img?.sourceUrl} />
    </div>
  ));

  return (
    <section className={styles.block}>
      <Container>
        {(title || description) && (
          <div className={styles.header}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        )}
        {slides.length > 0 && (
          <Carousel
            className={styles.slider}
            settings={{
              breakpoints: {
                1024: { slidesPerView: 4, spaceBetween: 24 },
                768: { slidesPerView: 2.5, spaceBetween: 20 },
              },
              slidesPerView: 1.2,
              spaceBetween: 16,
            }}
            showNavigation={images.length > 4}
            slides={slides}
          />
        )}
      </Container>
    </section>
  );
}
