import Image from 'next/image';

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
          {label && (
            <div className={styles.typeContainer}>
              {storeIcon && (
                <div className={styles.imageWrapper}>
                  <Image
                    alt={label}
                    className={styles.image}
                    height={193}
                    src={storeIcon}
                    width={193}
                  />
                </div>
              )}
              {label && (
                <p
                  className={styles.storeTypeLabel}
                  style={{
                    color: color,
                  }}
                >
                  {label}
                </p>
              )}
            </div>
          )}
          <div
            className={styles.address}
            dangerouslySetInnerHTML={{ __html: printedAddress }}
          ></div>
        </div>
      </div>
      {displays?.length > 0 && (
        <div className={styles.displaysContainer}>
          <div className={styles.separator} />
          <div className={styles.inStoreDisplays}>
            <p className={styles.displaysLabel}>In Store Displays</p>
            <div className={styles.displays}>
              {displays.map((product, idx) => {
                const imageUrl =
                  product?.productCategory?.nodes?.[0].mainCategoryDetails
                    ?.inStoreImage?.node?.mediaItemUrl;
                const altText = product.productCategory?.nodes?.[0].name;
                if (imageUrl) {
                  return (
                    <Image
                      alt={altText}
                      height={40}
                      key={idx}
                      src={imageUrl}
                      width={40}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
