'use client';

import { useCallback, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import { useClickOutside } from '@hooks/useClickOutside';
import MobileMenu from '@components/header/mobile-menu';
import Products from '@components/header/products';
import Button from '@components/button/button';
import Container from '@components/container/container';
import HamburgerButton from '@components/hamburger-button/hamburger-button';
import { primaryMenu } from '@mockup/primary-menu';
import { secondaryMenu } from '@mockup/secondary-menu';
import { socialMenu } from '@mockup/social-menu';
import { mobileMenu } from '@mockup/mobile-menu';
import Logo from '@assets/images/logo.svg';
import styles from './header.module.scss';

export default function Header() {
  const headerRef = useRef(null);
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const [currentSubmenu, setCurrentSubmenu] = useState(null);
  const toggleMenu = useCallback(() => {
    setIsMobileMenuActive(!isMobileMenuActive);
  }, [isMobileMenuActive]);

  const onElsewhereClick = useCallback(ev => {
    setCurrentSubmenu(null);
  }, []);

  const primaryMenuRef = useRef(null);
  const productsRef = useRef(null);

  useClickOutside(onElsewhereClick, [primaryMenuRef, productsRef]);

  return (
    <>
      <Helmet>
        <body className={isMobileMenuActive ? 'lock-scroll' : null} />
      </Helmet>

      <header className={styles.header} ref={headerRef}>
        <div className={styles.grid}>
          <div className={styles.hamburgerContainer}>
            <HamburgerButton
              onClick={toggleMenu}
              isActive={isMobileMenuActive}
            />
          </div>

          <Link className={styles.logo} href="/">
            <Logo />
          </Link>

          <div className={styles.callButtonContainer}>
            <Button
              className={styles.callButton}
              size="small"
              variant="secondary"
              background="dark"
              rightIcon="call"
            />
          </div>

          <nav className={styles.primaryMenu} ref={primaryMenuRef}>
            <ul className={styles.primaryMenuList}>
              {primaryMenu.map(
                ({ label, url, subItems, subItemGroups, name }, index) => (
                  <li key={index}>
                    <Button
                      href={url}
                      size="small"
                      variant="tertiary"
                      background="dark"
                      toggleable={
                        subItems?.length > 0 || subItemGroups?.length > 0
                          ? 'neutral'
                          : null
                      }
                      isToggled={currentSubmenu === name}
                      onToggleIconClick={() => {
                        const newValue = currentSubmenu === name ? null : name;
                        setCurrentSubmenu(newValue);
                      }}
                    >
                      {label}
                    </Button>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <nav className={styles.secondaryMenu}>
            <ul className={styles.secondaryMenuList}>
              {secondaryMenu.map(({ label, url, icon, variant }, index) => (
                <li key={index} className={styles.secondaryMenuItem}>
                  <Button
                    href={url}
                    size="xsmall"
                    variant={variant}
                    background="dark"
                    leftIcon={icon}
                  >
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.socialMenu}>
            <ul className={styles.socialMenuList}>
              {socialMenu.map(({ label, url, icon }, index) => (
                <li key={index} className={styles.socialMenuItem}>
                  <Button
                    href={url}
                    size="small"
                    variant="tertiary"
                    background="dark"
                    leftIcon={icon}
                  >
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          <MobileMenu items={mobileMenu} isMenuActive={isMobileMenuActive} />

          <div className={styles.vehicleSelection}>
            My vehicle
            <Button variant="primary">Choose</Button>
          </div>
        </div>

        <Products isActive={currentSubmenu === 'products'} ref={productsRef} />
      </header>
    </>
  );
}
