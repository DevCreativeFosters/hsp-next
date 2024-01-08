import Button from '@components/button/button';
import Container from '@components/container/container';
import Logo from '@images/logo.svg';
import styles from './footer.module.scss';

export default function Footer({ menus, text }) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerContainerA}>
          <div className={styles.footerContainerB}>
            <div className={styles.footerContainerC}>
              <div className={styles.column}>
                <div className={styles.logo}>
                  <Logo />
                </div>
                <p className={styles.text}>{text}</p>
              </div>
              <div className={styles.column}>
                <ul className={styles.menuList}>
                  {menus.hsp.map((menu, idx) => (
                    <li key={menu.label + idx} className={styles.menuItem}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={menu.url}
                          variant="tertiary"
                          rightIcon="arrow-forward"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={menu.url}
                          variant="footer-item"
                          size="xsmall"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <ul className={styles.menuList}>
                  {menus.lifestyle.map((menu, idx) => (
                    <li key={menu.label + idx} className={styles.menuItem}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={menu.url}
                          variant="tertiary"
                          rightIcon="arrow-forward"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={menu.url}
                          variant="footer-item"
                          size="xsmall"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.column}>
                <ul className={styles.menuList}>
                  {menus.products.map((menu, idx) => (
                    <li key={menu.label + idx} className={styles.menuItem}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={menu.url}
                          variant="tertiary"
                          rightIcon="arrow-forward"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={menu.url}
                          variant="footer-item"
                          size="xsmall"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.column}>
                <ul className={styles.menuList}>
                  {menus.services.map((menu, idx) => (
                    <li key={menu.label + idx} className={styles.menuItem}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={menu.url}
                          variant="tertiary"
                          rightIcon="arrow-forward"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={menu.url}
                          variant="footer-item"
                          size="xsmall"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.column}>
                <ul className={styles.menuList}>
                  {menus.resources.map((menu, idx) => (
                    <li key={menu.label + idx} className={styles.menuItem}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={menu.url}
                          variant="tertiary"
                          rightIcon="arrow-forward"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={menu.url}
                          variant="footer-item"
                          size="xsmall"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <ul className={styles.menuList}>
                  {menus.legal.map((menu, idx) => (
                    <li key={menu.label + idx} className={styles.menuItem}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={menu.url}
                          variant="tertiary"
                          rightIcon="arrow-forward"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={menu.url}
                          variant="footer-item"
                          size="xsmall"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.copyright}>
              <p className={styles.copyrightText}>
                Copyright HSP UTE LIDS {year}
              </p>

              <p className={styles.copyrightText}>Made by Xfive</p>
            </div>
            <p className={styles.recaptchaText}>
              <span>This site is protected by reCAPTCHA and the Google </span>
              <a href="https://policies.google.com/privacy">
                Privacy Policy
              </a>{' '}
              <span> and </span>
              <a href="https://policies.google.com/terms">
                Terms of Service
              </a>{' '}
              <span> apply. </span>
            </p>
          </div>
        </div>
      </Container>
      <div className={styles.backgroundGradient} />
    </footer>
  );
}
