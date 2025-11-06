import clsx from 'clsx';

import constants from '@lib/constants';

import StoreTile from '@components/store-tile/store-tile';

import styles from './store-tiles-list.module.scss';

export default function StoreTilesList({
  allLocations = null,
  filteredStores = [],
  normalizeStores = stores => stores,
  onSelect = () => {},
  selectedStore = null,
}) {
  // Find and normalize superstore if needed
  const getNormalizedSuperStore = () => {
    if (!allLocations) return null;

    const superStore = allLocations?.find(location =>
      location.storeCategories?.nodes[0]?.slug?.includes('super-store'),
    );

    if (superStore) {
      return normalizeStores([superStore])[0];
    }

    return null;
  };

  const normalizedSuperStore =
    filteredStores.length === 0 ? getNormalizedSuperStore() : null;

  return (
    <>
      {filteredStores.length > 0 ? (
        <ul className={styles.resultList}>
          {filteredStores.map((result, index) => {
            const isSelected =
              selectedStore?.geolocation?.lat === result.geolocation.lat &&
              selectedStore?.geolocation?.lng === result.geolocation.lng;
            return (
              <StoreTile
                item={result}
                key={index}
                onSelect={onSelect}
                selected={isSelected}
              />
            );
          })}
        </ul>
      ) : (
        <>
          <div className={clsx(styles.noResultsNotice, 'noResultsNotice')}>
            {constants.NO_RESULTS_NOTICE}
          </div>
          {normalizedSuperStore && (
            <ul className={clsx(styles.resultList, 'resultLeft')}>
              <StoreTile
                item={normalizedSuperStore}
                onSelect={onSelect}
                selected={false}
              />
            </ul>
          )}
        </>
      )}
    </>
  );
}
