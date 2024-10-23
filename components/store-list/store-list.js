import clsx from 'clsx';
import Image from 'next/image';

import useMobileVh from '@hooks/useMobileVh';

import styles from './store-list.module.scss';

export default function StoreList({
  className,
  items,
  onSelect,
  show,
  showMoreResults,
  style,
}) {
  useMobileVh();

  if (show && items?.length === 0) {
    return (
      <div className={className}>
        Sorry, there are no results within 200km radius of your selected
        location. Please contact HSP directly
        <h5 className={styles.header}>
          HSP 4X4 HEAD OFFICE <br /> FITTING CENTRE
        </h5>
        <br />
        <div className={styles.details}>
          40 Overseas Drive
          <br />
          Noble Park North VIC, NSW 3174, AU
        </div>
      </div>
    );
  }

  if (!items?.length > 0 || !show) return null;

  const results = showMoreResults ? items : items.slice(0, 5);

  return (
    <div className={clsx(styles.listWrapper, className)} style={style}>
      <ul className={styles.list}>
        {results.map((item, index) => {
          const { address, location, name } = item;
          const { city, country, postalCode, stateAbbr, street } = location;
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
              <div className={styles.header}>
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
              </div>
              {item?.displays?.length > 0 && (
                <div className={styles.displaysContainer}>
                  <div className={styles.separator} />
                  <div className={styles.inStoreDisplays}>
                    <p className={styles.displaysLabel}>In Store Displays</p>
                    <div className={styles.displays}>
                      {item?.displays?.map((product, idx) => {
                        const imageUrl =
                          product?.productCategory?.nodes?.[0]
                            .mainCategoryDetails?.inStoreImage?.node
                            ?.mediaItemUrl;
                        const altText =
                          product.productCategory?.nodes?.[0].name;
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
        })}
      </ul>
    </div>
  );
}
