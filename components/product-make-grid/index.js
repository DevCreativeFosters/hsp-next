'use client';

import { useMemo, useState } from 'react';

import clsx from 'clsx';

import { useIsMobile } from '@hooks/useIsMobile';

import Container from '@components/container/container';
import Pagination from '@components/pagination/pagination';
import ProductCard from '@components/product-card/product-card';
import TextElement from '@components/text-element/text-element';

import styles from './product-make-grid.module.scss';

export default function ProductMakeGrid({
  bodyText,
  products,
  productsPerPage,
  productsPerPageMobile,
  title,
  titleTag,
  titleTagStyle,
}) {
  const [page, setPage] = useState(1);
  const isMobile = useIsMobile();

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

  const TitleTag = titleTag[0] || 'h3';

  return (
    <Container>
      <div className={styles.container}>
        {title && (
          <TitleTag className={clsx(styles.title, titleTagStyle)}>
            <TextElement text={title} />
          </TitleTag>
        )}
        {bodyText && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: bodyText }}
          />
        )}
        <div className={styles.grid}>
          {products
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((product, index) => (
              <ProductCard
                imageUrl={product.productImage?.node?.mediaItemUrl}
                key={index}
                name={product.title}
                price={product.startingPrice}
                url={product.link?.url}
              />
            ))}
        </div>
        <Pagination
          current={page}
          maxPagesToShow={totalPages}
          onClick={handlePageClick}
          perPage={itemsPerPage}
          total={totalProducts}
        />
      </div>
    </Container>
  );
}
