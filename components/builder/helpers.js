import { Fragment } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { getIcon } from '@lib/icons';

import styles from '@components/builder/products-carousel.module.scss';

const PlusIcon = getIcon('plus');
const CheckMarkIcon = getIcon('check-mark');
const GroupIcon = getIcon('group');
const UngroupIcon = getIcon('ungroup');

export function isProductSelected(selectedProducts, slug) {
  let isSelected = false;
  selectedProducts.forEach(selectedProduct => {
    if (selectedProduct.variantSlug === slug) {
      isSelected = true;
    }
  });

  return isSelected;
}

export function getOtherProductsWithSameParent(
  products,
  productSlug,
  variantSlug,
) {
  return products
    .filter(product => product.group === productSlug)
    .flatMap(product => product.variants)
    .filter(variant => variant.variantSlug !== variantSlug)
    .filter(variant => variant.variantSlug)
    .map(variant => {
      return variant.variantSlug;
    });
}

export function getIncompatibleProducts(products, currentProduct, covers) {
  return products
    .filter(product => product.group !== currentProduct.productSlug)
    .flatMap(product => product.variants)
    .filter(variant => variant.productSlug !== currentProduct.productSlug)
    .filter(
      variant =>
        covers &&
        variant?.productCategories &&
        variant?.productCategories.some(
          category => !currentProduct.compatibleProducts.includes(category),
        ),
    )
    .filter(variant => variant.variantSlug)
    .filter(
      variant => !covers.some(cover => cover.group === variant.productSlug),
    )
    .map(variant => variant.variantSlug);
}

export function getSlides(
  products,
  selectedProducts,
  disabledProducts,
  toggleGroup,
  toggleProduct,
) {
  const slides = [];

  products?.forEach(group => {
    group?.variants.forEach((product, index) => {
      const { image, isGroup, productName, variantSlug } = product;
      const productTitle = productName;
      const productImage = image;
      const isSelected = isProductSelected(selectedProducts, variantSlug);
      const isDisabled = disabledProducts.includes(variantSlug);
      const isGroupItemOpen = isGroup && product.isOpen;
      const isGroupItemFirst = index === 0;
      const isGroupItemLast = index === group.variants.length - 1;

      const Icon = (
        <>
          {isGroup ? (
            <>
              {index === 0 ? (
                isGroupItemOpen ? (
                  <UngroupIcon />
                ) : (
                  <GroupIcon />
                )
              ) : isSelected ? (
                <CheckMarkIcon />
              ) : (
                <PlusIcon />
              )}
            </>
          ) : isSelected ? (
            <CheckMarkIcon />
          ) : (
            <PlusIcon />
          )}
        </>
      );

      const slide = (
        <Fragment key={index}>
          <button
            className={clsx(styles.product, {
              [styles.isSelected]: isSelected,
              [styles.isDisabled]:
                isGroupItemFirst && isGroup && isGroupItemOpen
                  ? false
                  : isDisabled,
              [styles.isGroupItem]: isGroup,
              [styles.isGroupItemOpen]: isGroupItemOpen,
              [styles.isGroupItemFirst]: isGroupItemFirst,
              [styles.isGroupItemLast]: isGroupItemLast,
            })}
            onClick={() => {
              isGroup && index === 0
                ? toggleGroup(group)
                : toggleProduct(product);
            }}
            type="button"
          >
            <div className={styles.productImageContainer}>
              <Image
                alt={productTitle}
                className={styles.productImage}
                height={Math.round(168 / 1.4)}
                src={productImage}
                style={{ objectFit: 'contain' }}
                width={168}
              />
            </div>
            <div className={styles.productIcon}>{Icon}</div>
            {productTitle && (
              <div className={styles.productMeta}>
                <p className={styles.productName}>{productTitle}</p>
                {index === 0 && group.minPrice > 0 && (
                  <span className={styles.productPrice}>
                    {isGroup && <>Starting from </>}
                    {new Intl.NumberFormat('en-AU', {
                      currency: 'AUD',
                      style: 'currency',
                    }).format(group.minPrice)}
                  </span>
                )}

                {index > 0 && product.price > 0 && (
                  <span className={styles.productPrice}>
                    {new Intl.NumberFormat('en-AU', {
                      currency: 'AUD',
                      style: 'currency',
                    }).format(product.price)}
                  </span>
                )}
              </div>
            )}
          </button>
        </Fragment>
      );

      if (!product.hidden) {
        slides.push(slide);
      }
    });
  });

  return slides;
}
