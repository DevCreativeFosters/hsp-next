import clsx from 'clsx';
import Button from '@components/button/button';
import styles from './store-list.module.scss';

export default function StoreList({
  className,
  items,
  limit,
  show,
  onSelect,
  onMore = () => null,
}) {
  if (show && items?.length === 0) {
    return <div>Sorry, there are no results for given location and radius</div>;
  }

  if (!items?.length > 0 || !show) return null;

  return (
    <div className={clsx(styles.listWrapper, className)}>
      <ul className={styles.list}>
        {items.slice(0, limit).map((item, index) => {
          const { name, location, address } = item;
          const { street, city, stateAbbr, postalCode, country } = location;
          let printedAddress = address
            .replaceAll('<br /><br /><br />', '<br />')
            .replaceAll('<br /><br />', '<br />')
            .replace('<br />Australia', ', Australia')
            .replace('<br />AUSTRALIA', ', Australia');
          if (street && city && stateAbbr && postalCode && country) {
            printedAddress = `${street}<br />${city}, ${stateAbbr} ${postalCode}, ${country}`;
          }

          return (
            <li
              className={styles.item}
              key={index}
              onClick={() => onSelect(item)}
            >
              <div className={styles.index}>{index + 1}</div>
              <div className={styles.details}>
                <div
                  className={styles.name}
                  dangerouslySetInnerHTML={{ __html: name }}
                ></div>
                <div
                  className={styles.address}
                  dangerouslySetInnerHTML={{ __html: printedAddress }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
      {items.length > limit && (
        <Button
          className={styles.more}
          variant="quaternary"
          size="xsmall"
          onClick={onMore}
        >
          Load more results
        </Button>
      )}
    </div>
  );
}
