'use client';

import { useCallback, useRef, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Link from 'next/link';
import clsx from 'clsx';
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
  mainProductCategories,
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
          <div
            className={clsx(styles.grid, {
              [styles.withoutSocialMenu]: !socialMenu,
            })}
          >
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
              {secondaryMenu?.map(item => {
                if (item.mobileDisplay === true) {
                  return (
                    <Button
                      key={item.url}
                      size="small"
                      variant="tertiary"
                      background="dark"
                      rightIcon={item.iconPredefined[0] || item.icon}
                    />
                  );
                }
              })}
            </div>

            <nav className={styles.mainMenu} ref={mainMenuRef}>
              <ul className={styles.mainMenuList}>
                {mainMenu?.map(({ label, url, subItems, name }, index) => (
                  <li key={label + index}>
                    <Button
                      href={url}
                      size="small"
                      variant="tertiary"
                      background="dark"
                      toggleable={
                        subItems?.length > 0 && url === '/products/'
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
                ))}
              </ul>
            </nav>

            <nav className={styles.secondaryMenu}>
              <ul className={styles.secondaryMenuList}>
                {secondaryMenu?.map(
                  ({ label, url, iconPredefined, icon, variant }, index) => (
                    <li
                      key={label + index}
                      className={styles.secondaryMenuItem}
                    >
                      <Button
                        href={url}
                        size="xsmall"
                        variant={variant}
                        background="dark"
                        leftIcon={
                          iconPredefined[0] !== 'CUSTOM'
                            ? iconPredefined[0]
                            : false
                        }
                        leftIconUrl={
                          iconPredefined[0] === 'CUSTOM' ? icon : false
                        }
                      >
                        {label}
                      </Button>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {socialMenu && (
              <nav className={styles.socialMenu}>
                <ul className={styles.socialMenuList}>
                  {socialMenu.map(({ url, iconPredefined, icon }, index) => (
                    <li key={url + index} className={styles.socialMenuItem}>
                      <Button
                        href={url}
                        size="small"
                        variant="tertiary"
                        background="dark"
                        leftIcon={
                          iconPredefined !== 'CUSTOM' ? iconPredefined : false
                        }
                        leftIconUrl={iconPredefined === 'CUSTOM' ? icon : false}
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <MobileMenu items={mobileMenu} isMenuActive={isMobileMenuActive} />

            <div className={styles.vehicleSelection}>
              <span className={styles.vehicleText}>My vehicle:</span>
              <ChooseYourVehicle makes={makes} />
            </div>
          </div>

          <Products
            isActive={currentSubmenu === 'products'}
            categories={mainProductCategories}
            products={products}
            ref={productsRef}
          />
        </FullscreenCollapse>
      </header>
    </>
  );
}
