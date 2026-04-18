'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { useCart } from '@contexts/cart-context';
import { useUserContext } from '@contexts/user';
import { useWishlist } from '@contexts/wishlist';

import { useClickOutside } from '@hooks/useClickOutside';

import Button from '@components/button/button';
import ChooseYourVehicle from '@components/choose-your-vehicle/choose-your-vehicle';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import HamburgerButton from '@components/hamburger-button/hamburger-button';
import MobileMenu from '@components/header/mobile-menu';
import Products from '@components/header/products';
import Shopbymake from '@components/header/shopbymake';

import Logo from '@assets/images/logo.png';

import styles from './header.module.scss';

export default function Header({
  mainMenu,
  mainProductCategories,
  makes,
  mobileMenu,
  preventHeaderCollapse = false,
  products,
  promoBanner,
  secondaryMenu,
}) {
  const { user } = useUserContext();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  const headerRef = useRef(null);
  const mainMenuRef = useRef(null);
  const productsRef = useRef(null);
  const shopByMakeRef = useRef(null);

  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const [currentSubmenu, setCurrentSubmenu] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const shopByMakeMenu = mainMenu.find(
    element => element.url === '/shop-by-ute-make/',
  )?.subItems;
  const productsMenu = mainMenu.find(
    element => element.url === '/products/',
  )?.subItems;

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasWishlistItems = wishlistItems?.length > 0 && user?.id;

  const toggleMenu = useCallback(() => {
    setIsMobileMenuActive(!isMobileMenuActive);
  }, [isMobileMenuActive]);

  const onElsewhereClick = useCallback(ev => {
    setCurrentSubmenu(null);
  }, []);

  const isScrolling = promoBanner?.scrollAnimation;

  const promoContent = useMemo(() => {
    const rawContent = promoBanner?.content || [];
    if (rawContent.length === 0) return null;

    const multiplier = isScrolling
      ? Math.max(10, Math.ceil((windowWidth * 2) / 300))
      : 1;

    return Array.from({ length: multiplier }).flatMap((_, i) =>
      rawContent.map((item, j) => {
        const img = item?.image?.node;
        return (
          <div className={styles.marqueeItem} key={`${i}-${j}`}>
            {img && (
              <Image
                alt={img?.altText || ''}
                height={22}
                src={img?.sourceUrl}
                width={22}
              />
            )}
            <span>{item.text}</span>
          </div>
        );
      }),
    );
  }, [isScrolling, promoBanner, windowWidth]);

  useClickOutside(onElsewhereClick, [mainMenuRef, productsRef, shopByMakeRef]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <body className={isMobileMenuActive ? 'lock-scroll' : null} />
        </Helmet>
      </HelmetProvider>

      <header className={styles.header} ref={headerRef}>
        {promoContent && (
          <div
            className={styles.headerTop}
            style={{
              background: promoBanner?.backgroundColor,
              color: promoBanner?.textColor,
            }}
          >
            <div
              className={clsx(
                styles.marqueeTrack,
                isScrolling && styles.scrollingText,
              )}
            >
              <div className={styles.trackGroup}>{promoContent}</div>
              <div className={styles.trackGroup}>{promoContent}</div>
            </div>
          </div>
        )}

        <FullscreenCollapse
          className={styles.headerInner}
          preventCollapse={preventHeaderCollapse}
        >
          <div className={styles.grid}>
            <div className={styles.hamburgerContainer}>
              <HamburgerButton
                isActive={isMobileMenuActive}
                onClick={toggleMenu}
              />
            </div>

            <Link className={styles.logo} href="/">
              <Image alt={'HSP Logo'} height={48} src={Logo} width={129} />
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
              <Button
                background="dark"
                className={clsx({
                  [styles.hasWishlistItems]: hasWishlistItems,
                })}
                href={
                  hasWishlistItems
                    ? `/account/${user?.role}#wishlist`
                    : user?.id
                      ? '#'
                      : '/login'
                }
                rightIcon={
                  hasWishlistItems ? 'filled-add-wishlist' : 'add-wishlist'
                }
                size="small"
                variant="tertiary"
              />
              <Button
                background="dark"
                href="/cart"
                rightIcon="cart"
                size="small"
                variant="tertiary"
              >
                {cartCount > 0 && (
                  <span className={styles.cartCount}>{cartCount}</span>
                )}
              </Button>
            </div>

            <nav className={styles.mainMenu} ref={mainMenuRef}>
              <ul className={styles.mainMenuList}>
                {mainMenu?.map(({ label, name, subItems, url }, index) => (
                  <li key={label + index}>
                    <Button
                      background="dark"
                      href={
                        subItems?.length > 0 &&
                        (url.includes('/products/') ||
                          url.includes('/shop-by-ute-make/'))
                          ? '#'
                          : url
                      }
                      isToggled={currentSubmenu === name}
                      onToggleIconClick={() => {
                        const newValue = currentSubmenu === name ? null : name;
                        setCurrentSubmenu(newValue);
                      }}
                      size="large"
                      toggleable={
                        subItems?.length > 0 &&
                        (url.includes('/products/') ||
                          url.includes('/shop-by-ute-make/'))
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
                        className={{
                          [styles.headerButton]:
                            variant == 'tertiary' || variant === 'septenary',
                        }}
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
                <li
                  className={clsx(styles.secondaryMenuItem, styles.cartButton)}
                >
                  <Button
                    background="dark"
                    href="/cart"
                    rightIcon="cart"
                    size="xsmall"
                    variant="tertiary"
                  >
                    {cartCount > 0 && (
                      <span className={styles.cartCount}>{cartCount}</span>
                    )}
                  </Button>
                </li>

                <li
                  className={clsx(
                    styles.secondaryMenuItem,
                    styles.wishlistButton,
                  )}
                >
                  <Button
                    background="dark"
                    className={clsx({
                      [styles.hasWishlistItems]: hasWishlistItems,
                    })}
                    href={
                      hasWishlistItems
                        ? `/account/${user?.role}#wishlist`
                        : user?.id
                          ? '#'
                          : '/login'
                    }
                    rightIcon={
                      hasWishlistItems ? 'filled-add-wishlist' : 'add-wishlist'
                    }
                    size="xsmall"
                    variant="tertiary"
                  />
                </li>

                <li
                  className={clsx(
                    styles.secondaryMenuItem,
                    styles.profileButton,
                  )}
                >
                  <Button
                    background="dark"
                    href={user?.id ? `/account/${user?.role}` : '/login'}
                    rightIcon="account-profile"
                    size="xsmall"
                    style={{ borderRadius: '24px' }}
                    variant="primary"
                  >
                    {user?.id
                      ? user?.role === 'retail'
                        ? 'Account'
                        : 'Dealer Account'
                      : 'Login / Sign Up'}
                  </Button>
                </li>
              </ul>
            </nav>

            <MobileMenu isMenuActive={isMobileMenuActive} items={mobileMenu} />

            <div className={styles.vehicleSelection}>
              <ChooseYourVehicle makes={makes} />
            </div>
          </div>

          <Products
            categories={productsMenu}
            isActive={currentSubmenu === 'products'}
            ref={productsRef}
          />
          <Shopbymake
            categories={shopByMakeMenu}
            isActive={currentSubmenu === 'shop by make'}
            ref={shopByMakeRef}
          />
        </FullscreenCollapse>
      </header>
    </>
  );
}
