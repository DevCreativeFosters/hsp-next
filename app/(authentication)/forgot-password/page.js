import Link from 'next/link';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import Arrow from '@assets/images/arrow.svg';

import ClientForgotForm from './client-forgot-form';
import styles from './forgot-password.module.scss';

export default function ForgotPassword() {
  return (
    <Layout title="Forgot Password | HSP">
      <section className={styles.accountContent}>
        <div className={styles.loginMain}>
          <Container className={styles.loginBG}>
            <div className={styles.loginBGWrap}>
              <div className={styles.loginWrap}>
                <ClientForgotForm />
              </div>
              <div className={styles.loginFooter}>
                <div className={styles.lfWrap}>
                  <div className={styles.leftPart}>
                    <h2>New to HSP?</h2>
                    <p>We’re happy to have you here!</p>
                  </div>
                  <div className={styles.rightPart}>
                    <Link className={styles.ctaButton} href="/register">
                      CREATE AN ACCOUNT <Arrow className="arrow" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </Layout>
  );
}
