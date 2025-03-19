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

export default function ProductAddons({
  description,
  products,
  title,
  titleTag,
  titleTagStyle,
}) {
  const buttonPrevRef = useRef();
  const buttonNextRef = useRef();

  const productsNormalized = products
    .map(product => {
      if (!product) return null;

      const imageUrl = product.imageUrl || null;
      const categories =
        product.productCategories?.filter(
          category => category.parent !== null,
        ) || [];
      const makesAndModels = product.makesAndModels || [];
      const variants = product.productFields?.variants || [];
      const categorySlug = categories[0]?.slug || product.categorySlug || null;
      const categoryName = categories[0]?.name || null;
      const model = makesAndModels.find(({ parent }) => parent) || {};
      const makeSlug = model.parent?.node?.slug || product.makeSlug || null;
      const modelSlug = model.slug || null;
      const cheapestVariant = variants.find(
        variant => variant.variantDetails.price === product.lowestPrice,
      );

      let url = null;

      if (categorySlug) {
        if (makeSlug) {
          if (modelSlug) {
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
          } else {
            url = routes.product(categorySlug, makeSlug);
          }
        } else {
          url = routes.product(categorySlug);
        }
      }

      return {
        category: categoryName ? categoryName : null,
        imageUrl,
        name: product?.title || null,
        price: product.lowestPrice,
        url,
      };
    })
    .filter(Boolean);

  if (!productsNormalized.length) {
    return null;
  }

  return (
    <Container collapseMargin flexibleBlockPadding>
      <SectionIntro
        description={description}
        noChildrenContainer
        title={title}
        titleTag={titleTag}
        titleTagStyle={titleTagStyle}
      >
        {products.length > 4 && (
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
        )}
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
