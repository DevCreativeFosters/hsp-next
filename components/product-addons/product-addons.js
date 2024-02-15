'use client';

import routes from '@lib/routes';
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
    const imageUrl = product.featuredImage?.sourceUrl;
    const categories = product.productCategories.nodes;
    const makesAndModels = product.makesAndModels.nodes.map(el => ({
      ...el,
      parent: el.parent?.node || null,
    }));
    const variants = product.productFields.variants;
    const categorySlug = categories[0]?.slug;
    const model = makesAndModels.find(({ parent }) => parent);
    const makeSlug = model?.parent?.slug; // 2
    const modelSlug = model?.slug;
    const cheapestVariant = variants?.find(
      ({ variantDetails: { price } }) => price === product.lowestPrice,
    );

    let url;
    if (categorySlug && makeSlug && modelSlug) {
      const variantSlug = cheapestVariant?.variantSlug;
      const variantSlugNormalized =
        variantSlug?.slice(0, 1) === '/' ? variantSlug.slice(1) : variantSlug;
      url = routes.product(
        categorySlug,
        makeSlug,
        modelSlug,
        variantSlugNormalized,
      );
    }

    return {
      url,
      imageUrl,
      name: product.title,
      price: product.lowestPrice,
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
        items={productsNormalized}
        itemTemplate={ProductItem}
        buttonPrevRef={buttonPrevRef}
        buttonNextRef={buttonNextRef}
        name="Addons"
      />
    </Container>
  );
}
