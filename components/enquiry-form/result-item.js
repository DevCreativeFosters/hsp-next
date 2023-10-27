import { useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import { getHash } from './results-and-map';
import { getIcon } from '@lib/icons';
import Button from '@components/button/button';

import TypeAgentImage from '@assets/images/type-agent.webp';
import TypeStoreImage from '@assets/images/type-store.webp';
import TypeDistributorImage from '@assets/images/type-distributor.webp';
import TypeHSPImage from '@assets/images/type-hsp.webp';

import styles from './result-item.module.scss';

const LocationIcon = getIcon('location');
const PhoneIcon = getIcon('phone');

export default function ResultItem({
  item: {
    name,
    location: { street, city, stateAbbr, postalCode, country },
    address,
    tel,
    geolocation,
    type,
    distance,
  },
  selected,
}) {
  let storeImage;
  switch (type) {
    case 'AGENT':
      storeImage = TypeAgentImage;
      break;
    case 'STORE':
      storeImage = TypeStoreImage;
      break;
    case 'DISTRIBUTOR':
      storeImage = TypeDistributorImage;
      break;
    case 'HSP':
      storeImage = TypeHSPImage;
      break;
  }

  const geoHash = getHash(geolocation);
  const telNormalized = tel.replaceAll(/([^0-9+])/gi, '');

  const { lat, lng } = geolocation;
  let addressString = address;
  if (street && city && stateAbbr && postalCode && country) {
    addressString = `${street}<br />${city}, ${stateAbbr} ${postalCode}, ${country}`;
  }

  const addressStringPure = addressString.replaceAll('<br />', ', ');

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const distanceNormalized = Math.round(distance / 1000);

  const copyAddressToClipboard = useCallback(() => {
    try {
      copy(addressStringPure);
    } catch (err) {
      console.log(err);
    }
  }, [addressStringPure]);

  return (
    <li
      className={clsx(styles.resultItem, { [styles.isSelected]: selected })}
      id={geoHash}
    >
      <div className={styles.nameContainer}>
        <div
          className={styles.name}
          dangerouslySetInnerHTML={{ __html: name }}
        />
        {storeImage && (
          <div className={styles.imageWrapper}>
            <Image className={styles.image} src={storeImage} alt={type} />
          </div>
        )}
      </div>
      <div className={styles.location}>
        <div className={styles.icon}>
          <LocationIcon />
        </div>
        <div onClick={copyAddressToClipboard}>
          {street && city && stateAbbr && postalCode && country ? (
            <>
              <div>{street}</div>
              <div>
                <span>{city}, </span>
                <span>{stateAbbr} </span>
                <span>{postalCode}</span>
              </div>
              <div>{country}</div>
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: addressString }}></div>
          )}
        </div>
      </div>
      <a className={styles.tel} href={`tel:${telNormalized}`}>
        <div className={styles.icon}>
          <PhoneIcon />
        </div>
        {tel}
      </a>
      <div className={styles.pusher} />
      <div className={styles.separator} />
      <div className={styles.extra}>
        <div>
          <Button
            className={styles.link}
            variant="tertiary"
            size="small"
            rightIcon="external-link"
            href={directionsUrl}
            target="_blank"
          >
            Directions
          </Button>
        </div>

        {distanceNormalized ? (
          <div className={styles.distance}>({distanceNormalized} km)</div>
        ) : null}
      </div>
    </li>
  );
}
