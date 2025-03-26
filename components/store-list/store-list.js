import clsx from 'clsx';

import useMobileVh from '@hooks/useMobileVh';

import constants from '@lib/constants';
import normalizeStores from '@lib/normalize-stores';

import StoreListItem from './store-list-item';
import styles from './store-list.module.scss';

export default function StoreList({
  allLocations,
  className,
  itemInList = false,
  items,
  onSelect,
  paddingRight,
  show,
  showCategory = true,
  showDisplays = true,
  showIndex = true,
  showMoreResults,
  style,
  wideLayout = false,
}) {
  useMobileVh();

  if (show && items?.length === 0) {
    const superStore = allLocations?.find(location =>
      location.storeCategories?.nodes[0]?.slug?.includes('super-store'),
    );

    if (superStore) {
      const normalizedSuperStore = normalizeStores([superStore])[0];

      return (
        <>
          <div className={styles.noResultsNotice}>
            {constants.NO_RESULTS_NOTICE}
          </div>

          <ul className={styles.list}>
            <StoreListItem
              index={1}
              item={normalizedSuperStore}
              itemInList={itemInList}
              onSelect={onSelect}
              showCategory={showCategory}
              showDisplays={showDisplays}
              showIndex={showIndex}
              wideLayout={wideLayout}
            />
          </ul>
        </>
      );
    } else {
      return (
        <div className={styles.noResultsNotice}>
          {constants.NO_RESULTS_NOTICE}
        </div>
      );
    }
  }

  if (!items?.length > 0 || !show) return null;

  const results =
    showMoreResults === undefined || showMoreResults === true
      ? items
      : items.slice(0, 5);

  const listWrapperStyle = {
    ...(paddingRight && { paddingRight }),
    ...style,
  };

  return (
    <div
      className={clsx(styles.listWrapper, className)}
      style={listWrapperStyle}
    >
      <ul className={styles.list}>
        {results.map((item, index) => (
          <StoreListItem
            index={index + 1}
            item={item}
            itemInList={itemInList}
            key={index}
            onSelect={onSelect}
            showCategory={showCategory}
            showDisplays={showDisplays}
            showIndex={showIndex}
            wideLayout={wideLayout}
          />
        ))}
      </ul>
    </div>
  );
}
