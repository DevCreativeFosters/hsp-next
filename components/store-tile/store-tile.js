import { useCallback } from 'react';

import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import Image from 'next/image';

import { getGeoHash } from '@lib/get-geo-hash';
import { getIcon } from '@lib/icons';

import Button from '@components/button/button';

import TypeMajorImage from '@assets/images/type-major.webp';
import TypeSuperImage from '@assets/images/type-super.webp';

import styles from './store-tile.module.scss';

const LocationIcon = getIcon('location');
const PhoneIcon = getIcon('phone');

export default function StoreTile({
  item: {
    address,
    displays,
    geolocation,
    learnMoreButton,
    location: { city, country, postalCode, stateAbbr, street },
    name,
    tel,
    type,
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
    } catch (error) {
      console.log('Error: ', error);
    }
  }, [addressStringPure]);

  return (
    <li
      className={clsx(styles.tile, { [styles.isSelected]: selected })}
      id={geoHash}
    >
      <div className={styles.name} dangerouslySetInnerHTML={{ __html: name }} />
      {storeTypeLabel && (
        <div className={styles.typeContainer}>
          {storeImage && (
            <div className={styles.imageWrapper}>
              <Image alt={type} className={styles.image} src={storeImage} />
            </div>
          )}
          {storeTypeLabel && (
            <p
              className={clsx(styles.storeTypeLabel, {
                [styles.major]: type === 'MAJOR',
                [styles.super]: type === 'SUPER',
              })}
            >
              {storeTypeLabel}
            </p>
          )}
        </div>
      )}
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
            href={directionsUrl}
            rel="noopener noreferrer"
            rightIcon="external-link"
            size="small"
            target="_blank"
            variant="quinary"
          >
            Directions
          </Button>
        )}
        {learnMoreButton && (
          <Button
            className={styles.link}
            href={learnMoreButton?.url}
            rel="noopener noreferrer"
            rightIcon="external-link"
            size="small"
            target="_blank"
            variant="primary"
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
                  product?.productCategory?.nodes?.[0]?.mainCategoryDetails
                    ?.inStoreImage?.node?.mediaItemUrl;
                const altText = product.productCategory?.name;
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
