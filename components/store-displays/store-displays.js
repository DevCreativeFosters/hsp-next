import clsx from 'clsx';
import Image from 'next/image';

import Accordion from '@components/accordion/accordion';
import AccordionItem from '@components/accordion/accordion-item';

import styles from './store-displays.module.scss';

const renderLogo = product => {
  const imageUrl =
    product?.productCategory?.nodes?.[0]?.mainCategoryDetails?.inStoreImage
      ?.node?.mediaItemUrl;
  const altText =
    product.productCategory?.nodes?.[0]?.name || product.productCategory?.name;

  const uniqueId =
    product?.productCategory?.nodes?.[0]?.databaseId || Math.random();

  if (!imageUrl) return null;

  return (
    <Image
      alt={altText}
      className={styles.logo}
      height={32}
      key={uniqueId}
      src={imageUrl}
      width={107}
    />
  );
};

export default function StoreDisplays({
  alwaysOpen = false,
  displays,
  flexStoresList = false,
  hideSeparator = false,
  showNumberOfProducts = true,
}) {
  if (!displays?.length) return null;

  const displayCount = displays?.length || 0;
  const displayText = `${displayCount} ${displayCount === 1 ? 'product' : 'products'}`;
  const triggerText = (
    <div>
      In-store Displays: <span>{displayText}</span>
    </div>
  );

  const displayLogos = (
    <div
      className={clsx(styles.displays, { [styles.wideDisplays]: alwaysOpen })}
    >
      {displays.map(product => renderLogo(product))}
    </div>
  );

  return (
    <div
      className={clsx(styles.container, {
        [styles.flexStoresList]: flexStoresList,
      })}
    >
      {!hideSeparator && <div className={styles.separator} />}
      {alwaysOpen ? (
        <div className={styles.alwaysOpen}>
          <div className={clsx(styles.toggle, 'in-store-displays')}>
            In-store Displays:{' '}
            {showNumberOfProducts && <span>{displayText}</span>}
          </div>
          {displayLogos}
        </div>
      ) : (
        <Accordion className={styles.accordion}>
          <AccordionItem
            className={styles.toggle}
            resetStyling
            triggerContent={triggerText}
          >
            {displayLogos}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
