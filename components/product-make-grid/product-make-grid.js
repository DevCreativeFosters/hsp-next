'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';

import { useIsMobile } from '@hooks/useIsMobile';

import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';
import Pagination from '@components/pagination/pagination';
import ProductCard from '@components/product-card/product-card';

import styles from './product-make-grid.module.scss';

const sortOptions = [
  { label: 'Price High To Low', value: 'price_desc' },
  { label: 'Price Low To High', value: 'price_asc' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Newest Arrivals', value: 'newest' },
];

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
  const [isBrandsFilterOpen, setIsBrandsFilterOpen] = useState(true);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleBrandsFilterToggle = () => {
    setIsBrandsFilterOpen(prev => !prev);
  };

  const handleSortToggle = () => {
    setIsSortDropdownOpen(prev => !prev);
  };

  const handleSortSelect = option => {
    setSelectedSortOption(option);
    setIsSortDropdownOpen(false);
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
          <div className={styles.mobileTitle}>Sort By:</div>
          <div className={styles.leftwrap}>
            <div className={styles.priceFilter}>
              <div className={styles.pWrap}>
                <div className={styles.title}>Sort By:</div>

                <div
                  className={clsx(styles.customSelectBox, {
                    [styles.open]: isSortDropdownOpen,
                  })}
                  ref={sortDropdownRef}
                >
                  <div
                    aria-controls="sort-options-list"
                    aria-expanded={isSortDropdownOpen}
                    className={styles.selectedOption}
                    onClick={handleSortToggle}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSortToggle();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {selectedSortOption.label}
                    <div className={styles.arrow}></div>
                  </div>

                  {isSortDropdownOpen && (
                    <ul className={styles.optionsList} id="sort-options-list">
                      {sortOptions.map(option => (
                        <li
                          aria-selected={
                            option.value === selectedSortOption.value
                          }
                          className={clsx({
                            [styles.selected]:
                              option.value === selectedSortOption.value,
                          })}
                          key={option.value}
                          onClick={() => handleSortSelect(option)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSortSelect(option);
                            }
                          }}
                          role="option"
                          tabIndex={0}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.chekboxLists}>
              <div
                className={clsx(styles.filterClick, {
                  [styles.open]: isBrandsFilterOpen,
                })}
                onClick={handleBrandsFilterToggle}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleBrandsFilterToggle();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className={styles.filterTitle}>Brands:</div>
              </div>
              <div
                className={clsx(styles.filterContent, {
                  [styles.open]: isBrandsFilterOpen,
                })}
              >
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
