'use client';

import { useRef } from 'react';
import clsx from 'clsx';
import SectionButtons from '@components/section-buttons/section-buttons';
import TileCarousel from '@components/tile-carousel/tile-carousel';
import Container from '@components/container/container';
import SectionIntro from '@components/section-intro/section-intro';
import ProductItem from '@components/product-addons/product-item';
import Button from '@components/button/button';

import styles from './product-addons.module.scss';

export default function ProductAddons({ title, description, products }) {
  const buttonPrevRef = useRef();
  const buttonNextRef = useRef();

  const productsNormalized = products.map(product => {
    const urlNormalized =
      product.url || product.link?.url || product.link || '';
    const imageUrl = product.featuredImage?.sourceUrl;

    return {
      url: urlNormalized,
      imageUrl,
      name: product.title,
      price: 2300,
    };
  });

  return (
    <Container collapseMargin>
      <SectionIntro title={title} description={description}>
        <SectionButtons>
          <div className={styles.buttons}>
            <Button
              ref={buttonPrevRef}
              className={clsx(styles.button, styles.prev)}
              variant="secondary"
              leftIcon="expand-more-neutral"
            />
            <Button
              ref={buttonNextRef}
              className={clsx(styles.button, styles.next)}
              variant="secondary"
              leftIcon="expand-more-neutral"
            />
          </div>
        </SectionButtons>
      </SectionIntro>

      <TileCarousel
        className={styles.carousel}
        items={productsNormalized}
        itemTemplate={ProductItem}
        buttonPrevRef={buttonPrevRef}
        buttonNextRef={buttonNextRef}
        name="Addons"
      />
    </Container>
  );
}
