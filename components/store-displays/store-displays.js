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

export default function StoreDisplays({ displays }) {
  if (!displays?.length) return null;

  const displayCount = displays?.length || 0;
  const displayText = `${displayCount} ${displayCount === 1 ? 'product' : 'products'}`;
  const triggerText = (
    <div>
      Store Displays: <span>{displayText}</span>
    </div>
  );

  const displayLogos = (
    <div className={styles.displays}>
      {displays.map(product => renderLogo(product))}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.separator} />
      <Accordion className={styles.accordion}>
        <AccordionItem
          className={styles.toggle}
          resetStyling
          triggerContent={triggerText}
        >
          {displayLogos}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
