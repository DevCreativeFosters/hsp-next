'use client';

import { useCallback, useRef, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Link from 'next/link';
import { useClickOutside } from '@hooks/useClickOutside';
import MobileMenu from '@components/header/mobile-menu';
import Products from '@components/header/products';
import Button from '@components/button/button';
import HamburgerButton from '@components/hamburger-button/hamburger-button';
import Logo from '@assets/images/logo.svg';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import styles from './header.module.scss';
import ChooseYourVehicle from '@components/choose-your-vehicle/choose-your-vehicle';

export default function Header({
  mainMenu,
  secondaryMenu,
  socialMenu,
  mobileMenu,
  productCategories,
  products,
  makes,
}) {
  const headerRef = useRef(null);
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const [currentSubmenu, setCurrentSubmenu] = useState(null);
  const toggleMenu = useCallback(() => {
    setIsMobileMenuActive(!isMobileMenuActive);
  }, [isMobileMenuActive]);

  const onElsewhereClick = useCallback(ev => {
    setCurrentSubmenu(null);
  }, []);

  const mainMenuRef = useRef(null);
  const productsRef = useRef(null);

  useClickOutside(onElsewhereClick, [mainMenuRef, productsRef]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <body className={isMobileMenuActive ? 'lock-scroll' : null} />
        </Helmet>
      </HelmetProvider>

      <header className={styles.header} ref={headerRef}>
        <FullscreenCollapse className={styles.headerInner}>
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

            <nav className={styles.mainMenu} ref={mainMenuRef}>
              <ul className={styles.mainMenuList}>
                {mainMenu?.map(
                  ({ label, url, subItems, subItemGroups, name }, index) => (
                    <li key={index}>
                      <Button
                        href={url}
                        size="small"
                        variant="tertiary"
                        background="dark"
                        toggleable={
                          (subItems?.length > 0 || subItemGroups?.length > 0) &&
                          url === ''
                            ? 'neutral'
                            : null
                        }
                        isToggled={currentSubmenu === name}
                        onToggleIconClick={() => {
                          const newValue =
                            currentSubmenu === name ? null : name;
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
                {secondaryMenu?.map(({ label, url, icon, variant }, index) => (
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
                {socialMenu?.map(({ url, icon }, index) => (
                  <li key={index} className={styles.socialMenuItem}>
                    <Button
                      href={url}
                      size="small"
                      variant="tertiary"
                      background="dark"
                      leftIconUrl={icon}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            <MobileMenu items={mobileMenu} isMenuActive={isMobileMenuActive} />

            <div className={styles.vehicleSelection}>
              <span className={styles.vehicleText}>My vehicle:</span>
              <ChooseYourVehicle makes={makes} />
            </div>
          </div>

          <Products
            isActive={currentSubmenu === 'products'}
            categories={productCategories}
            products={products}
            ref={productsRef}
          />
        </FullscreenCollapse>
      </header>
    </>
  );
}
