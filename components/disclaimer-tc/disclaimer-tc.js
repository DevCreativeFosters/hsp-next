import Link from 'next/link';
import routes from '@lib/routes';
import { getIcon } from '@lib/icons';
import clsx from 'clsx';
import styles from './disclaimer-tc.module.scss';

export default function DisclaimerTC({ fullWidth, withBlockMargin }) {
  const InfoIcon = getIcon('info');

  return (
    <div
      className={clsx(styles.disclaimer, {
        [styles.fullWidth]: fullWidth,
        [styles.withBlockMargin]: withBlockMargin,
      })}
    >
      <InfoIcon />
      <div>
        By submitting the form you agree to our{' '}
        <Link href={routes.privacyAndTerms}>Terms & Conditions.</Link>
      </div>
    </div>
  );
}
