'use client';

import Container from '@components/container/container';
import InformationBox from '@components/information-box/information-box';

import styles from './store-locator-hero.module.scss';

export default function StoreLocatorHero() {
  return (
    <Container>
      <section className={styles.wrapper}>
        <main className={styles.main}>
          <h1 className={styles.title}>Locate your store</h1>
          <div className={styles.description}>
            <p>
              We have first class fitters located all around Australia for your
              peace of mind.
            </p>
          </div>
        </main>
        <InformationBox className={styles.aside} hideOn="mobile" isSidebar />
      </section>
    </Container>
  );
}
