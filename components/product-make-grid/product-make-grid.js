'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { useIsMobile } from '@hooks/useIsMobile';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getProductCategories } from '@lib/api/get-product-categories';
import { makeRelativeUrl } from '@lib/helpers';

import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';
import Loading from '@components/loading/loading';
import Pagination from '@components/pagination/pagination';
import ProductCard from '@components/product-card/product-card';

import styles from './product-make-grid.module.scss';

const sortOptions = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price High To Low', value: 'price_desc' },
  { label: 'Price Low To High', value: 'price_asc' },
  { label: 'Newest Arrivals', value: 'newest' },
];

// TODO: Check to give the filter or not
export default function ProductMakeGrid({
  alignment,
  bodyText,
  categoryPages,
  products,
  productsPerPage,
  productsPerPageMobile,
  productsTitleTag,
  productsTitleTagStyle,
  showCategories,
  showFilters,
  showMakes,
  template,
  title,
  titleTag,
  titleTagStyle,
}) {
  // Treat undefined as "on" so missing CMS data (e.g. testing WP not yet
  // exposing the show_filters ACF field) still renders the sidebar.
  // An explicit `false` from the editor still hides it.
  const filtersOn = showFilters !== false;

  const availableBrands = products.map(
    item => new URL(item.link.url, 'http://_').pathname.split('/')[2],
  );

  const availableCategories = products.map(
    item => new URL(item.link.url, 'http://_').pathname.split('/')[1],
  );

  const priorityOrder = [
    'electric-roller-cover',
    'roll-up-tonneau-cover',
    'load-rack-pro', // if exists
    'load-rack-jnr', // if exists
    'nz-load-slide',
    'ute-sports-bar',
    'tailgate-lock',
    'tailgate-assist',
  ];

  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);

  const [activeFilter, setActiveFilter] = useState(null);
  const isSortDropdownOpen = activeFilter === 'sort';
  const isBrandsFilterOpen = activeFilter === 'brands';
  const isCategoriesFilterOpen = activeFilter === 'categories';

  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
  const [allMakes, setAllMakes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        if (activeFilter === 'sort') setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeFilter]);

  useEffect(() => {
    function loadData() {
      getAllMakes().then(makes => {
        setAllMakes(makes);
      });
      getProductCategories().then(categories => {
        setAllCategories(categories);
      });
    }
    loadData();
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

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    // If no brand selected → show all products
    if (selectedBrands.length === 0) return products;

    return products.filter(product => {
      const url = product?.link?.url?.toLowerCase() || '';
      return selectedBrands.some(slug => url.includes(`/${slug}`));
    });
  }, [products, selectedBrands]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageClick = pageNumber => {
    setPage(pageNumber);
  };

  const handleBrandsFilterToggle = () => {
    setActiveFilter(prev => (prev === 'brands' ? null : 'brands'));
  };

  const handleCategoriesFilterToggle = () => {
    setActiveFilter(prev => (prev === 'categories' ? null : 'categories'));
  };

  const handleSortToggle = () => {
    setActiveFilter(prev => (prev === 'sort' ? null : 'sort'));
  };

  const handleSortSelect = option => {
    setSelectedSortOption(option);
    setActiveFilter(null);
  };

  const handleBrandChange = slug => {
    setSelectedBrands(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug],
    );
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (selectedSortOption.value) {
      case 'price_desc':
        return sorted.sort(
          (a, b) => (b.startingPrice || 0) - (a.startingPrice || 0),
        );

      case 'price_asc':
        return sorted.sort(
          (a, b) => (a.startingPrice || 0) - (b.startingPrice || 0),
        );

      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded),
        );

      case 'popularity':
        return sorted;

      default:
        return sorted;
    }
  }, [filteredProducts, selectedSortOption]);

  const currentProducts = useMemo(() => {
    return sortedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [itemsPerPage, page, sortedProducts]);

  useEffect(() => {
    setPage(1);
  }, [selectedBrands, selectedSortOption]);

  return (
    <Container collapseTopPadding={filtersOn} flexibleBlockPadding>
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
      {categoryPages && categoryPages.length > 0 && (
        <div className={styles.topFilter}>
          <ul>
            {categoryPages.map(({ link }) => (
              <li key={link.url}>
                <Link href={makeRelativeUrl(link.url)}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.productMain}>
        {filtersOn && (
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
              {showMakes && (
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
                    <div className={styles.filterTitle}>Vehicle Brands:</div>
                  </div>
                  <div
                    className={clsx(styles.filterContent, {
                      [styles.open]: isBrandsFilterOpen,
                    })}
                  >
                    {allMakes.length === 0 ? (
                      <ul>
                        <li>
                          <Loading />
                        </li>
                      </ul>
                    ) : (
                      <ul>
                        {allMakes
                          .filter(make => availableBrands.includes(make.slug))
                          .map((make, index) => (
                            <li key={make.slug}>
                              <label>
                                <input
                                  checked={selectedBrands.includes(make.slug)}
                                  onChange={() => handleBrandChange(make.slug)}
                                  type="checkbox"
                                />
                                <span>{make.name}</span>
                              </label>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
              {showCategories && (
                <div className={styles.chekboxLists}>
                  <div
                    className={clsx(styles.filterClick, {
                      [styles.open]: isCategoriesFilterOpen,
                    })}
                    onClick={handleCategoriesFilterToggle}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCategoriesFilterToggle();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.filterTitle}>Products:</div>
                  </div>
                  <div
                    className={clsx(styles.filterContent, {
                      [styles.open]: isCategoriesFilterOpen,
                    })}
                  >
                    {allCategories.length === 0 ? (
                      <ul>
                        <li>
                          <Loading />
                        </li>
                      </ul>
                    ) : (
                      <ul>
                        {allCategories
                          .filter(make =>
                            availableCategories.includes(make.slug),
                          )
                          .sort((a, b) => {
                            const aIndex = priorityOrder.indexOf(a.slug);
                            const bIndex = priorityOrder.indexOf(b.slug);

                            const aOrder = aIndex === -1 ? 999 : aIndex;
                            const bOrder = bIndex === -1 ? 999 : bIndex;

                            if (aOrder !== bOrder) return aOrder - bOrder;

                            // fallback → alphabetical
                            return a.name.localeCompare(b.name);
                          })
                          .map((make, index) => (
                            <li key={make.slug}>
                              <label>
                                <input
                                  checked={selectedBrands.includes(make.slug)}
                                  onChange={() => handleBrandChange(make.slug)}
                                  type="checkbox"
                                />
                                <span>{make.name}</span>
                              </label>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={clsx({
            [styles.noFilters]: !filtersOn,
            [styles.rightPart]: filtersOn,
          })}
        >
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

          {filteredProducts.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <div className={styles.grid}>
              {currentProducts.map((product, index) => (
                <ProductCard
                  hasFilters={filtersOn}
                  imageUrl={product.productImage?.node?.mediaItemUrl}
                  key={`product-${index}-${product.title?.replace(/\s+/g, '-').toLowerCase()}`}
                  name={product.title}
                  price={product.startingPrice}
                  removeBorder={true}
                  template={template}
                  titleTag={productsTitleTag}
                  titleTagStyle={productsTitleTagStyle}
                  url={makeRelativeUrl(product.link?.url)}
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
