'use client';

import Button from '@components/button/button';
import Container from '@components/container/container';
import styles from './store-locator-hero.module.scss';

export default function StoreLocatorHero() {
  return (
    <div className={styles.wrapper}>
      <Container>
        <h1 className={styles.title}>ILocate your store</h1>
        <div className={styles.description}>
          <p>
            IWe have first class fitters located all around Australia for your
            peace of mind.
          </p>
        </div>

        <Button
          className={styles.button}
          rightIcon="search"
          href="#store-locator-form"
        >
          ISearch
        </Button>

        <aside className={styles.aside}>
          <h3 className={styles.asideTitle}>IBecome a Distributor</h3>
          <div className={styles.asideDescription}>
            <p>
              IFor more information on becoming a HSP Distributor or Fitter,
              please contact us on <a href="tel:1300441498">1300 441 498</a> or
              send an email to{' '}
              <a href="mailto:info@hsputelids.com">info@hsputelids.com</a>.
            </p>
          </div>
        </aside>
      </Container>
    </div>
  );
}
