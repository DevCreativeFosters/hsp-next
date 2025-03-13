'use client';

import { useEffect, useMemo, useState } from 'react';

import clsx from 'clsx';

import { useIsMobile } from '@hooks/useIsMobile';

import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';
import Pagination from '@components/pagination/pagination';
import ProductCard from '@components/product-card/product-card';

import styles from './product-make-grid.module.scss';

export default function ProductMakeGrid({
  alignment,
  bodyText,
  products,
  productsPerPage,
  productsPerPageMobile,
  productsTitleTag,
  productsTitleTagStyle,
  title,
  titleTag,
  titleTagStyle,
}) {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [isMobile]);

  const itemsPerPage = useMemo(() => {
    if (isMobile) {
      return productsPerPageMobile || 8;
    }
    return productsPerPage || 16;
  }, [isMobile, productsPerPage, productsPerPageMobile]);

  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageClick = pageNumber => {
    setPage(pageNumber);
  };

  const currentProducts = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return [];
    }
    return products.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [itemsPerPage, page, products]);

  return (
    <Container flexibleBlockPadding>
      {title && (
        <DynamicTitle
          className={clsx(styles.title, styles[alignment] || styles.left)}
          defaultTag="h2"
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {title}
        </DynamicTitle>
      )}
      {bodyText && (
        <div
          className={clsx(
            styles.description,
            styles[alignment] || styles.left,
            'p-large',
          )}
          dangerouslySetInnerHTML={{ __html: bodyText }}
        />
      )}

      {!products || totalProducts === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className={styles.grid}>
          {currentProducts.map((product, index) => (
            <ProductCard
              imageUrl={product.productImage?.node?.mediaItemUrl}
              key={product.id || product.databaseId}
              name={product.title}
              price={product.startingPrice}
              removeBorder={true}
              titleTag={productsTitleTag}
              titleTagStyle={productsTitleTagStyle}
              url={product.link?.url}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          current={page}
          isMobileEllipsisCompact
          maxMobilePagesToShow={2}
          maxPagesToShow={3}
          onClick={handlePageClick}
          perPage={itemsPerPage}
          removeMarginBottom
          removeMarginTop
          total={totalProducts}
        />
      )}
    </Container>
  );
}
