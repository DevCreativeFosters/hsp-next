import { useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import { getIcon } from '@lib/icons';
import { getGeoHash } from '@lib/get-geo-hash';
import Button from '@components/button/button';

import TypeSuperImage from '@assets/images/type-super.webp';
import TypeMajorImage from '@assets/images/type-major.webp';

import styles from './store-tile.module.scss';

const LocationIcon = getIcon('location');
const PhoneIcon = getIcon('phone');

export default function StoreTile({
  item: {
    name,
    location: { street, city, stateAbbr, postalCode, country },
    address,
    tel,
    geolocation,
    type,
    displays,
    learnMoreButton,
  },
  selected,
}) {
  let storeImage;
  let storeTypeLabel;
  switch (type) {
    case 'SUPER':
      storeImage = TypeSuperImage;
      storeTypeLabel = 'Super Store';
      break;
    case 'MAJOR':
      storeImage = TypeMajorImage;
      storeTypeLabel = 'Major Distributor';
      break;
  }

  const geoHash = getGeoHash(geolocation);
  const telNormalized = tel?.toString().replaceAll(/([^0-9+])/gi, '');

  const { lat, lng } = geolocation;
  let addressString = address;
  if (street && city && stateAbbr && postalCode && country) {
    addressString = `${street}<br />${city}, ${stateAbbr} ${postalCode}, ${country}`;
  }

  const addressStringPure = addressString.replaceAll('<br />', ', ');

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const copyAddressToClipboard = useCallback(() => {
    try {
      copy(addressStringPure);
    } catch (err) {
      console.log(err);
    }
  }, [addressStringPure]);

  return (
    <li
      className={clsx(styles.tile, { [styles.isSelected]: selected })}
      id={geoHash}
    >
      <div className={styles.name} dangerouslySetInnerHTML={{ __html: name }} />
      <div className={styles.typeContainer}>
        {storeImage && (
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={storeImage} alt={type} />
          </div>
        )}
        <p
          className={clsx(styles.storeTypeLabel, {
            [styles.major]: type === 'MAJOR',
            [styles.super]: type === 'SUPER',
          })}
        >
          {storeTypeLabel}
        </p>
      </div>
      <div className={styles.location}>
        <div className={styles.icon}>
          <LocationIcon />
        </div>
        <div onClick={copyAddressToClipboard}>
          {street || city || stateAbbr || postalCode || country ? (
            <>
              {street && <div>{street}</div>}
              <div>
                {city && <span>{city}, </span>}
                {stateAbbr && <span>{stateAbbr} </span>}
                {postalCode && <span>{postalCode}</span>}
              </div>
              {country && <div>{country}</div>}
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: addressString }}></div>
          )}
        </div>
      </div>
      {tel && (
        <a className={styles.tel} href={`tel:${telNormalized}`}>
          <div className={styles.icon}>
            <PhoneIcon />
          </div>
          {tel}
        </a>
      )}
      <div className={styles.extra}>
        {directionsUrl && (
          <Button
            className={styles.link}
            variant="quinary"
            size="small"
            rightIcon="external-link"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions
          </Button>
        )}
        {learnMoreButton && (
          <Button
            className={styles.link}
            variant="primary"
            size="small"
            rightIcon="external-link"
            href={learnMoreButton?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {learnMoreButton?.title && learnMoreButton?.title !== ''
              ? learnMoreButton?.title
              : 'Learn more'}
          </Button>
        )}
      </div>
      <div className={styles.pusher} />
      {displays?.length > 1 && (
        <div className={styles.displaysContainer}>
          <div className={styles.separator} />
          <div className={styles.inStoreDisplays}>
            <p className={styles.displaysLabel}>In Store Displays</p>
            <div className={styles.displays}>
              {displays.map((product, idx) => {
                const imageUrl =
                  product.productCategory.mainCategoryDetails?.inStoreImage
                    ?.mediaItemUrl;
                const altText = product.productCategory.name;
                if (imageUrl) {
                  return (
                    <Image
                      key={idx + altText}
                      src={imageUrl}
                      alt={altText}
                      width={40}
                      height={40}
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
