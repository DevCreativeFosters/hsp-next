import clsx from 'clsx';

import { useContext } from 'react';
import StoreTile from './store-tile';
import StoreLocatorContext from '@contexts/store-locator';

import styles from './store-tile.module.scss';

export default function ResultsStoreTile({ item, isHighlighted }) {
  const { setSelectedStore } = useContext(StoreLocatorContext);

  return (
    <div className={styles.resultUI}>
      <div className={styles.resultContainer}>
        <StoreTile item={item} />
      </div>
      <button
        type="button"
        className={clsx(styles.resultClearButton, {
          [styles.isHighlighted]: isHighlighted,
        })}
        onClick={() => setSelectedStore(null)}
        aria-label="Clear chosen store"
      >
        <span />
      </button>
    </div>
  );
}
