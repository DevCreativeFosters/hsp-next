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

  console.log(
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
  );

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
      <div className={styles.topFilter}>
        <ul>
          <li>
            <button>Electric Roll Tops</button>
          </li>
          <li>
            <button>Roll Up Tonneau Cover</button>
          </li>
          <li>
            <button>Ute Tray Slides</button>
          </li>
          <li>
            <button>Ladder Racks</button>
          </li>
          <li>
            <button>Tailgate Accessories</button>
          </li>
        </ul>
      </div>
      <div className={styles.productMain}>
        <div className={styles.leftPart}>
          <div className={styles.priceFilter}>
            <div className={styles.pWrap}>
              <div className={styles.title}>Sort By:</div>
              <div className={styles.selectBox}>
                <select>
                  <option>Price High To Low</option>
                  <option>Price Low To High</option>
                  <option>Popularity</option>
                  <option>Newest Arrivals</option>
                </select>
                <div className={styles.arrow}></div>
              </div>
            </div>
          </div>

          <div className={styles.chekboxLists}>
            <div className={styles.filterClick}>
              <div className={styles.filterTitle}>Brands:</div>
            </div>
            <div className={styles.filterContent}>
              <ul>
                <li>
                  <label>
                    <input id="1" name="filtername" type="checkbox" />
                    <span>Ford</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>Volkswagen</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>Kia</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>Mitsubishi</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>Nissan</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>MG</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>BYD</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span>Chevrolet</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.rightPart}>
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
                  key={`product-${index}-${product.title?.replace(/\s+/g, '-').toLowerCase()}`}
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
        </div>
      </div>

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
