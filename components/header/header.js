'use client';

import { useCallback, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { useClickOutside } from '@hooks/useClickOutside';

import Button from '@components/button/button';
import ChooseYourVehicle from '@components/choose-your-vehicle/choose-your-vehicle';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import HamburgerButton from '@components/hamburger-button/hamburger-button';
import MobileMenu from '@components/header/mobile-menu';
import Products from '@components/header/products';

import Logo from '@assets/images/logo.png';

import styles from './header.module.scss';

export default function Header({
  mainMenu,
  mainProductCategories,
  makes,
  mobileMenu,
  products,
  secondaryMenu,
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
                isActive={isMobileMenuActive}
                onClick={toggleMenu}
              />
            </div>

            <Link className={styles.logo} href="/">
              <Image alt={'HSP Logo'} height={50} src={Logo} width={130} />
            </Link>

            <div className={styles.callButtonContainer}>
              {secondaryMenu?.map(item => {
                if (item.mobileDisplay === true) {
                  return (
                    <Button
                      background="dark"
                      href={item.url || '#'}
                      key={item.url}
                      rightIcon={item.iconPredefined[0] || item.icon}
                      size="small"
                      variant="tertiary"
                    />
                  );
                }
              })}
            </div>

            <nav className={styles.mainMenu} ref={mainMenuRef}>
              <ul className={styles.mainMenuList}>
                {mainMenu?.map(({ label, name, subItems, url }, index) => (
                  <li key={label + index}>
                    <Button
                      background="dark"
                      href={url}
                      isToggled={currentSubmenu === name}
                      onToggleIconClick={() => {
                        const newValue = currentSubmenu === name ? null : name;
                        setCurrentSubmenu(newValue);
                      }}
                      size="small"
                      toggleable={
                        subItems?.length > 0 && url.includes('/products/')
                          ? 'neutral'
                          : null
                      }
                      variant="tertiary"
                    >
                      {label}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className={styles.secondaryMenu}>
              <ul className={styles.secondaryMenuList}>
                {secondaryMenu?.map(
                  ({ icon, iconPredefined, label, url, variant }, index) => (
                    <li
                      className={styles.secondaryMenuItem}
                      key={label + index}
                    >
                      <Button
                        background="dark"
                        href={url}
                        leftIcon={
                          iconPredefined[0] !== 'CUSTOM'
                            ? iconPredefined[0]
                            : false
                        }
                        leftIconUrl={
                          iconPredefined[0] === 'CUSTOM' ? icon : false
                        }
                        size="xsmall"
                        variant={variant}
                      >
                        {label}
                      </Button>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <MobileMenu isMenuActive={isMobileMenuActive} items={mobileMenu} />

            <div className={styles.vehicleSelection}>
              <ChooseYourVehicle makes={makes} />
            </div>
          </div>

          <Products
            categories={mainProductCategories}
            isActive={currentSubmenu === 'products'}
            products={products}
            ref={productsRef}
          />
        </FullscreenCollapse>
      </header>
    </>
  );
}
