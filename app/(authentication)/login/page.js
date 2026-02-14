import Image from 'next/image';
import Link from 'next/link';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import LoginForm from '@components/login-form/login-form';

import Arrow from '@assets/images/arrow.svg';
import banner from '@assets/images/loginbanner.jpg';

import styles from './login.module.scss';

export default function LoginPage() {
  return (
    <Layout title="Login - HSP">
      <section className={styles.accountContent}>
        <div className={styles.mobilebg}>
          <figure>
            <Image
              alt="Login Banner"
              fill
              src={banner}
              style={{ objectFit: 'cover' }}
            />
          </figure>
        </div>
        <div className={styles.loginMain}>
          <Container className={styles.loginBG}>
            <div className={styles.loginBGWrap}>
              <div className={styles.loginWrap}>
                {/* LEFT IMAGE SIDE */}
                <div className={styles.loginLeft}>
                  <figure>
                    <Image
                      alt="Login Banner"
                      fill
                      src={banner}
                      style={{ objectFit: 'cover' }}
                    />
                  </figure>
                </div>

                {/* RIGHT FORM SIDE */}
                <LoginForm />
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
