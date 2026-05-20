import Logo from '@images/logo.png';
import clsx from 'clsx';
import Image from 'next/image';

import { makeRelativeUrl } from '@lib/helpers';

import Button from '@components/button/button';
import Container from '@components/container/container';

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
                <div className={styles.logoColumn}>
                  <div className={styles.logo}>
                    <Image alt={'HSP Logo'} height={24} src={Logo} width={65} />
                  </div>
                  <p className={clsx(styles.text, 'p-small')}>{text}</p>
                </div>
              </div>
              <div className={styles.column}>
                <ul className={styles.menuList}>
                  {menus.hsp.map((menu, idx) => (
                    <li className={styles.menuItem} key={menu.label + idx}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          rightIcon="arrow-forward"
                          variant="tertiary"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          size="xsmall"
                          variant="footer-item"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <ul className={styles.menuList}>
                  {menus.lifestyle.map((menu, idx) => (
                    <li className={styles.menuItem} key={menu.label + idx}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          rightIcon="arrow-forward"
                          variant="tertiary"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          size="xsmall"
                          variant="footer-item"
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
                    <li className={styles.menuItem} key={menu.label + idx}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          rightIcon="arrow-forward"
                          variant="tertiary"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          size="xsmall"
                          variant="footer-item"
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
                    <li className={styles.menuItem} key={menu.label + idx}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          rightIcon="arrow-forward"
                          variant="tertiary"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          size="xsmall"
                          variant="footer-item"
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
                    <li className={styles.menuItem} key={menu.label + idx}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          rightIcon="arrow-forward"
                          variant="tertiary"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          size="xsmall"
                          variant="footer-item"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                <ul className={styles.menuList}>
                  {menus.legal.map((menu, idx) => (
                    <li className={styles.menuItem} key={menu.label + idx}>
                      {idx === 0 ? (
                        <Button
                          footer={true}
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          rightIcon="arrow-forward"
                          variant="tertiary"
                        >
                          {menu.label}
                        </Button>
                      ) : (
                        <Button
                          href={makeRelativeUrl(menu.url)}
                          inlineOffsetByPadding
                          size="xsmall"
                          variant="footer-item"
                        >
                          {menu.label}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.mobileFooter}>
              <div className={styles.footerContainerC}>
                <div className={styles.column}>
                  <div className={styles.logoColumn}>
                    <div className={styles.logo}>
                      <Image
                        alt={'HSP Logo'}
                        height={24}
                        src={Logo}
                        width={65}
                      />
                    </div>
                    <p className={clsx(styles.text, 'p-small')}>{text}</p>
                  </div>
                </div>
                <div className={styles.column}>
                  <ul className={styles.menuList}>
                    {menus.hsp.map((menu, idx) => (
                      <li className={styles.menuItem} key={menu.label + idx}>
                        {idx === 0 ? (
                          <Button
                            footer={true}
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            rightIcon="arrow-forward"
                            variant="tertiary"
                          >
                            {menu.label}
                          </Button>
                        ) : (
                          <Button
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            size="xsmall"
                            variant="footer-item"
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
                    {menus.lifestyle.map((menu, idx) => (
                      <li className={styles.menuItem} key={menu.label + idx}>
                        {idx === 0 ? (
                          <Button
                            footer={true}
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            rightIcon="arrow-forward"
                            variant="tertiary"
                          >
                            {menu.label}
                          </Button>
                        ) : (
                          <Button
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            size="xsmall"
                            variant="footer-item"
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
                      <li className={styles.menuItem} key={menu.label + idx}>
                        {idx === 0 ? (
                          <Button
                            footer={true}
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            rightIcon="arrow-forward"
                            variant="tertiary"
                          >
                            {menu.label}
                          </Button>
                        ) : (
                          <Button
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            size="xsmall"
                            variant="footer-item"
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
                      <li className={styles.menuItem} key={menu.label + idx}>
                        {idx === 0 ? (
                          <Button
                            footer={true}
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            rightIcon="arrow-forward"
                            variant="tertiary"
                          >
                            {menu.label}
                          </Button>
                        ) : (
                          <Button
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            size="xsmall"
                            variant="footer-item"
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
                      <li className={styles.menuItem} key={menu.label + idx}>
                        {idx === 0 ? (
                          <Button
                            footer={true}
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            rightIcon="arrow-forward"
                            variant="tertiary"
                          >
                            {menu.label}
                          </Button>
                        ) : (
                          <Button
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            size="xsmall"
                            variant="footer-item"
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
                    {menus.legal.map((menu, idx) => (
                      <li className={styles.menuItem} key={menu.label + idx}>
                        {idx === 0 ? (
                          <Button
                            footer={true}
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            rightIcon="arrow-forward"
                            variant="tertiary"
                          >
                            {menu.label}
                          </Button>
                        ) : (
                          <Button
                            href={makeRelativeUrl(menu.url)}
                            inlineOffsetByPadding
                            size="xsmall"
                            variant="footer-item"
                          >
                            {menu.label}
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
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
              <a
                href="https://policies.google.com/privacy"
                rel="noopener"
                target="_blank"
              >
                Privacy Policy
              </a>{' '}
              <span> and </span>
              <a
                href="https://policies.google.com/terms"
                rel="noopener"
                target="_blank"
              >
                Terms of Service
              </a>{' '}
              <span> apply. </span>
            </p>
            <p className={styles.copyrightTextMobile}>Made by Xfive</p>
          </div>
        </div>
      </Container>
      <div className={styles.backgroundGradient} />
    </footer>
  );
}
