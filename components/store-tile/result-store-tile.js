import { useContext } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';

import StoreTile from './store-tile';
import styles from './store-tile.module.scss';

export default function ResultsStoreTile({ isHighlighted, item }) {
  const { setSelectedStore } = useContext(StoreLocatorContext);

  return (
    <div className={styles.resultUI}>
      <div className={styles.resultContainer}>
        <StoreTile item={item} />
      </div>
      <button
        aria-label="Clear chosen store"
        className={clsx(styles.resultClearButton, {
          [styles.isHighlighted]: isHighlighted,
        })}
        onClick={() => setSelectedStore(null)}
        type="button"
      >
        <span />
      </button>
    </div>
  );
}
