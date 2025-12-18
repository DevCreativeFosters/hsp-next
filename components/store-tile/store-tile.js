import { useCallback } from 'react';

import clsx from 'clsx';
import copy from 'copy-to-clipboard';

import { getGeoHash } from '@lib/get-geo-hash';
import { getIcon } from '@lib/icons';

import Button from '@components/button/button';
import StoreCategory from '@components/store-category/store-category';
import StoreDisplays from '@components/store-displays/store-displays';

import styles from './store-tile.module.scss';

const LocationIcon = getIcon('location');
const PhoneIcon = getIcon('phone');

export default function StoreTile({ item, onSelect = () => {}, selected }) {
  const {
    address,
    color,
    displays,
    geolocation,
    label,
    learnMoreButton,
    location: { city, country, postalCode, stateAbbr, street },
    name,
    storeIcon,
    tel,
  } = item;

  let storeTypeLabel = label;

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
      onClick={() => onSelect(item)}
    >
      <div className={styles.name} dangerouslySetInnerHTML={{ __html: name }} />
      <div className={styles.storeCategory}>
        <StoreCategory color={color} icon={storeIcon} label={storeTypeLabel} />
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
      <StoreDisplays displays={displays} />
    </li>
  );
}
