import { Fragment } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { slideImageSizes } from '@components/builder/products-carousel';
import styles from '@components/builder/products-carousel.module.scss';
import SlideIcon from '@components/builder/slide-icon';

export function isProductSelected(selectedProducts, slug) {
  return selectedProducts.some(
    selectedProduct => selectedProduct.variantSlug === slug,
  );
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
  selectedCover,
  selectedProducts,
  disabledProducts,
  toggleGroup,
  toggleProduct,
) {
  const slides = [];
  products?.forEach(product => {
    let disabledCount = 0;
    let variants = [];
    product?.variants.forEach((variant, index) => {
      const { image, isGroup, productTitle, variantSlug } = variant;
      const attributes = {
        isGroupItemFirst: index === 0,
        isGroupItemLast: index === product.variants.length - 1,
        isGroupItemOpen: isGroup && variant.isOpen,
        isSelected: isProductSelected(selectedProducts, variantSlug),
        productImage: image,
        productTitle: productTitle,
      };

      const isDisabled = disabledProducts.includes(variantSlug);

      disabledCount += isDisabled ? 1 : 0;

      let slide = getSlideMarkup(
        attributes,
        isDisabled,
        isGroup,
        product,
        toggleGroup,
        toggleProduct,
        variant,
        index,
      );

      if (isGroup && disabledCount === product.variants.length - 1) {
        const group = variants.shift();
        const { image, productTitle } = product.variants[0];

        variants.unshift(
          getSlideMarkup(
            {
              isGroupItemFirst: true,
              isGroupItemLast: true,
              isGroupItemOpen: false,
              isSelected: false,
              productImage: image,
              productTitle: productTitle,
            },
            true,
            true,
            product,
            toggleGroup,
            toggleProduct,
            group,
            0,
          ),
        );
      } else if (!variant.hidden) {
        variants.push(slide);
      }
    });

    if (variants.length > 0) {
      slides.push(...variants);
    }
  });

  return slides;
}

function getSlideMarkup(
  attributes,
  isDisabled,
  isGroup,
  product,
  toggleGroup,
  toggleProduct,
  variant,
  index,
) {
  const {
    isGroupItemFirst,
    isGroupItemLast,
    isGroupItemOpen,
    isSelected,
    productImage,
    productTitle,
  } = attributes;

  return (
    <Fragment key={index}>
      <button
        className={clsx(styles.product, {
          [styles.isSelected]: isSelected,
          [styles.isDisabled]:
            isGroupItemFirst && isGroup && isGroupItemOpen ? false : isDisabled,
          [styles.isGroupItem]: isGroup,
          [styles.isGroupItemOpen]: isGroupItemOpen,
          [styles.isGroupItemFirst]: isGroupItemFirst,
          [styles.isGroupItemLast]: isGroupItemLast,
        })}
        onClick={() => {
          isGroup && index === 0
            ? toggleGroup(product)
            : toggleProduct(variant);
        }}
        type="button"
      >
        <div className={styles.productImageContainer}>
          <Image
            alt={productTitle}
            className={styles.productImage}
            height={slideImageSizes.height}
            src={productImage}
            style={{ objectFit: 'contain' }}
            width={slideImageSizes.width}
          />
        </div>
        <div className={styles.productIcon}>
          <SlideIcon
            index={index}
            isGroup={isGroup}
            isGroupItemOpen={isGroupItemOpen}
            isSelected={isSelected}
          />
        </div>
        {productTitle && (
          <div className={styles.productMeta}>
            <p className={styles.productName}>{productTitle}</p>
            {index === 0 && product.minPrice > 0 && (
              <span className={styles.productPrice}>
                {isGroup && <>Starting from </>}
                {new Intl.NumberFormat('en-AU', {
                  currency: 'AUD',
                  style: 'currency',
                }).format(product.minPrice)}
              </span>
            )}

            {index > 0 && variant.price > 0 && (
              <span className={styles.productPrice}>
                {new Intl.NumberFormat('en-AU', {
                  currency: 'AUD',
                  style: 'currency',
                }).format(variant.price)}
              </span>
            )}
            {isDisabled && (
              <div className={styles.incompatible}>
                Incompatible with current configuration
              </div>
            )}
          </div>
        )}
      </button>
    </Fragment>
  );
}

export function filterOutIncompatibleProducts(products, selectedCover) {
  const filteredProducts = [];

  products?.forEach((product, index) => {
    const variants = [];

    const isCoverCompatible = product.compatibleCovers.find(cover => {
      return selectedCover?.productCategories?.includes(cover);
    });

    if (isCoverCompatible) {
      if (!filteredProducts[index]) {
        filteredProducts[index] = product;
      }
    }

    product?.productFields?.variants?.forEach(variant => {
      const compatibleCoversVariants =
        variant?.compatibleCoversVariants?.nodes?.map(
          category => category.slug,
        ) || [];

      const isCoverVariantCompatible = compatibleCoversVariants.some(
        category => {
          return selectedCover?.productCategories?.includes(category);
        },
      );

      if (isCoverVariantCompatible) {
        if (!filteredProducts[index]) {
          filteredProducts[index] = product;
        }

        variants.push(variant);
      }
    });

    if (variants.length > 0) {
      filteredProducts[index]['productFields']['variants'] = variants;
    }
  });

  return filteredProducts;
}

export function getIncompatibleFactoryOptions(
  selectedFactoryOption,
  product,
  currentStep,
) {
  const incompatibleFactoryOptions = [];

  if (currentStep !== 2 || !selectedFactoryOption) {
    return incompatibleFactoryOptions;
  }

  const compatibleFactoryOptions =
    product?.compatibleFactoryOptionsVariants ||
    product?.compatibleFactoryOptions ||
    [];

  if (
    compatibleFactoryOptions.every(option => {
      const productCategories =
        selectedFactoryOption.productCategories.nodes.map(
          category => category.slug,
        );

      return !productCategories.includes(option);
    })
  ) {
    incompatibleFactoryOptions.push(selectedFactoryOption.title);
  }

  return incompatibleFactoryOptions;
}

export function getIncompatibleCovers(selectedProducts, product, covers) {
  return (
    selectedProducts
      ?.filter(
        selectedProduct =>
          !selectedProduct.productCategories?.some(category =>
            product.compatibleCovers.includes(category),
          ),
      )
      ?.filter(cover => covers.some(c => c.group === cover.productSlug))
      ?.map(cover => cover.productName) || []
  );
}

export function updateSelectedCoverVariant(
  covers,
  selectedCover,
  selectedProducts,
  currentProduct,
) {
  const selectedCoverIndex =
    covers.findIndex(cover => cover.group === selectedCover.productSlug) || 0;

  // keep old selection in case nothing is compatible
  let newVariant = selectedCover;

  covers[selectedCoverIndex]?.variants?.forEach(variant => {
    if (variant.isNoCover) {
      return;
    }

    const isCompatible = currentProduct?.productCategories?.some(category =>
      variant?.compatibleCategoriesVariants?.includes(category),
    );

    if (isCompatible) {
      newVariant = {
        ...variant,
        image: selectedCover.image,
      };
    }
  });

  const newSelectedProducts = selectedProducts?.map((product, index) => {
    if (index === 0) {
      return newVariant;
    }

    return product;
  });

  return {
    cover: newVariant,
    products: newSelectedProducts,
  };
}

export function sortProducts(products) {
  return products.sort((a, b) => {
    const aOrder =
      a?.productCategories?.nodes[0]?.categoryRelations?.order || 0;
    const bOrder =
      b?.productCategories?.nodes[0]?.categoryRelations?.order || 0;

    return aOrder - bOrder;
  });
}
