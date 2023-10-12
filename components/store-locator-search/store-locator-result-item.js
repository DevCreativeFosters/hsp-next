import Button from '@components/button/button';
import { getIcon } from '@lib/icons';
import styles from '@components/store-locator-search/store-locator-result-item.module.scss';

const LocationIcon = getIcon('location');
const PhoneIcon = getIcon('phone');

export default function StoreLocatorResultItem({
  item: {
    name,
    location: { street, city, stateAbbr, postalCode, country },
    address,
    tel,
    directions_url,
  },
}) {
  return (
    <li className={styles.resultItem}>
      <div className={styles.name} dangerouslySetInnerHTML={{ __html: name }} />

      <div className={styles.location}>
        <div className={styles.icon}>
          <LocationIcon />
        </div>
        <div>
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
            <div dangerouslySetInnerHTML={{ __html: address }}></div>
          )}
        </div>
      </div>

      <div className={styles.tel}>
        <div className={styles.icon}>
          <PhoneIcon />
        </div>
        {tel}
      </div>

      <div className={styles.pusher} />
      <div className={styles.separator} />

      <div className={styles.link}>
        <Button
          className={styles.link}
          variant="tertiary"
          size="small"
          rightIcon="external-link"
          href={directions_url}
        >
          Directions
        </Button>
      </div>
    </li>
  );
}
