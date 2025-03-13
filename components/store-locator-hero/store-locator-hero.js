'use client';

import clsx from 'clsx';

import Container from '@components/container/container';

import styles from './store-locator-hero.module.scss';

export default function StoreLocatorHero() {
  return (
    <Container>
      <section className={styles.wrapper}>
        <main className={styles.main}>
          <h1 className={styles.title}>Locate your store</h1>
          <div className={clsx(styles.description, 'p-large')}>
            <p>
              We have first class fitters located all around Australia for your
              peace of mind.
            </p>
          </div>
        </main>
      </section>
    </Container>
  );
}
