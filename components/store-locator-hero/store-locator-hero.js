'use client';

import Button from '@components/button/button';
import Container from '@components/container/container';
import styles from './store-locator-hero.module.scss';

export default function StoreLocatorHero() {
  return (
    <Container>
      <section className={styles.wrapper}>
        <main className={styles.main}>
          <h1 className={styles.title}>[ Locate your store ]</h1>
          <div className={styles.description}>
            <p>
              [ We have first class fitters located all around Australia for
              your peace of mind. ]
            </p>
          </div>

          <Button
            className={styles.button}
            size="large"
            rightIcon="search"
            href="#store-search"
          >
            ISearch
          </Button>
        </main>

        <aside className={styles.aside}>
          <h3 className={styles.asideTitle}>[ Become a Distributor ]</h3>
          <div className={styles.asideDescription}>
            <p>
              [ For more information on becoming a HSP Distributor or Fitter,
              please contact us on <a href="tel:1300441498">1300 441 498</a> or
              send an email to
              <a href="mailto:info@hsputelids.com">info@hsputelids.com</a>. ]
            </p>
          </div>
        </aside>
      </section>
    </Container>
  );
}
