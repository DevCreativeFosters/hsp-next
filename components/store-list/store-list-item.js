import clsx from 'clsx';

import StoreCategory from '@components/store-category/store-category';
import StoreDisplays from '@components/store-displays/store-displays';

import styles from './store-list-item.module.scss';

export default function StoreListItem({
  index,
  item,
  itemInList = false,
  onSelect,
  showCategory = true,
  showDisplays = true,
  showIndex = true,
}) {
  const { address, color, displays, label, location, name, storeIcon } = item;
  const { city, country, postalCode, stateAbbr, street } = location || {};

  let printedAddress = address
    ?.replaceAll('<br /><br /><br />', '<br />')
    ?.replaceAll('<br /><br />', '<br />')
    ?.replace('<br />Australia', ', Australia')
    ?.replace('<br />AUSTRALIA', ', Australia');

  if (street && city && stateAbbr && postalCode && country) {
    printedAddress = `${street}<br />${city}, ${stateAbbr} ${postalCode}, ${country}`;
  }

  return (
    <li
      className={clsx(styles.item, {
        [styles.itemInList]: itemInList,
      })}
      onClick={() => onSelect(item)}
    >
      <div className={styles.header}>
        {showIndex && <div className={styles.index}>{index}</div>}
        <div className={styles.details}>
          <div
            className={styles.name}
            dangerouslySetInnerHTML={{ __html: name }}
          ></div>
          {showCategory && (
            <StoreCategory color={color} icon={storeIcon} label={label} />
          )}
          <div
            className={styles.address}
            dangerouslySetInnerHTML={{ __html: printedAddress }}
          ></div>
        </div>
      </div>
      {showDisplays && <StoreDisplays displays={displays} />}
    </li>
  );
}
