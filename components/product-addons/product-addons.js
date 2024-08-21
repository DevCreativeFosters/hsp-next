'use client';

import { useRef } from 'react';

import clsx from 'clsx';

import routes from '@lib/routes';

import Button from '@components/button/button';
import Container from '@components/container/container';
import ProductItem from '@components/product-addons/product-item';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import TileCarousel from '@components/tile-carousel/tile-carousel';

import styles from './product-addons.module.scss';

export default function ProductAddons({ description, products, title }) {
  const buttonPrevRef = useRef();
  const buttonNextRef = useRef();

  const productsNormalized = products
    .map(product => {
      if (!product) return null;

      const imageUrl = product.imageUrl || null;
      const categories = product.productCategories || [];
      const makesAndModels = product.makesAndModels || [];
      const variants = product.productFields?.variants || [];
      const categorySlug = categories[0]?.slug || null;
      const model = makesAndModels.find(({ parent }) => parent) || {};
      const makeSlug = model.parent?.slug || null;
      const modelSlug = model.slug || null;
      const cheapestVariant = variants.find(
        variant => variant.variantDetails.price === product.lowestPrice,
      );

      let url = null;
      if (categorySlug && makeSlug && modelSlug) {
        const variantSlug = cheapestVariant?.variantSlug || null;
        const variantSlugNormalized = variantSlug?.startsWith('/')
          ? variantSlug.slice(1)
          : variantSlug;
        url = routes.product(
          categorySlug,
          makeSlug,
          modelSlug,
          variantSlugNormalized,
        );
      }

      return {
        imageUrl,
        name: product.title,
        price: product.lowestPrice,
        url,
      };
    })
    .filter(Boolean);

  if (!productsNormalized.length) {
    return null;
  }

  return (
    <Container collapseMargin>
      <SectionIntro description={description} title={title}>
        <SectionButtons>
          <div className={styles.buttons}>
            <Button
              className={clsx(styles.button, styles.prev)}
              leftIcon="expand-more-neutral"
              ref={buttonPrevRef}
              variant="secondary"
            />
            <Button
              className={clsx(styles.button, styles.next)}
              leftIcon="expand-more-neutral"
              ref={buttonNextRef}
              variant="secondary"
            />
          </div>
        </SectionButtons>
      </SectionIntro>

      <TileCarousel
        buttonNextRef={buttonNextRef}
        buttonPrevRef={buttonPrevRef}
        itemTemplate={ProductItem}
        items={productsNormalized}
        name="Addons"
      />
    </Container>
  );
}
