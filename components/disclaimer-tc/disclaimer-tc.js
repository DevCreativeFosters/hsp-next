import Link from 'next/link';
import routes from '@lib/routes';
import { getIcon } from '@lib/icons';
import styles from './disclaimer-tc.module.scss';

export default function DisclaimerTC() {
  const InfoIcon = getIcon('info');

  return (
    <div className={styles.disclaimer}>
      <InfoIcon />
      <div>
        By submitting the form you agree to our{' '}
        <Link href={routes.privacyAndTerms}>Terms & Conditions.</Link>
      </div>
    </div>
  );
}
