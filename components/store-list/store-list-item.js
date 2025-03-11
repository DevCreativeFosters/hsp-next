import StoreCategory from '@components/store-category/store-category';
import StoreDisplays from '@components/store-displays/store-displays';

import styles from './store-list-item.module.scss';

export default function StoreListItem({ index, item, onSelect }) {
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
    <li className={styles.item} onClick={() => onSelect(item)}>
      <div className={styles.header}>
        <div className={styles.index}>{index}</div>
        <div className={styles.details}>
          <div
            className={styles.name}
            dangerouslySetInnerHTML={{ __html: name }}
          ></div>
          <StoreCategory color={color} icon={storeIcon} label={label} />
          <div
            className={styles.address}
            dangerouslySetInnerHTML={{ __html: printedAddress }}
          ></div>
        </div>
      </div>
      <StoreDisplays displays={displays} />
    </li>
  );
}
