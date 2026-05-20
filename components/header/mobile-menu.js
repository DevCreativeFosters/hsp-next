'use client';

import { useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { makeRelativeUrl } from '@lib/helpers';

import ArrowForword from '@assets/icons/arrow-forward.svg';
import ArrowIcon from '@assets/icons/arrow-next.svg';
import CloseIcon from '@assets/icons/close.svg';

import MobileMenuItem from './mobile-menu-item';
import styles from './mobile-menu.module.scss';

export default function MobileMenu({
  isMenuActive,
  items,
  onCloseLvl3,
  onOpenLvl3,
}) {
  const [isLvl3Open, setIsLvl3Open] = useState(false);
  const [openLvl4, setOpenLvl4] = useState(null);

  const openLvl3 = () => {
    setIsLvl3Open(true);
    onOpenLvl3 && onOpenLvl3();
  };

  const closeLvl3 = () => {
    setIsLvl3Open(false);
    setOpenLvl4(null);
    onCloseLvl3 && onCloseLvl3();
  };

  const [item, setItem] = useState(null);

  return (
    <div
      className={clsx(styles.mobileMenu, { [styles.isActive]: isMenuActive })}
    >
      <nav>
        <ul className={styles.mobileMenuList}>
          {items?.map((item, i) => {
            const { image, label, subItemGroups, subItems, url } = item;
            if (image?.node?.sourceUrl) return null;

            return (
              <MobileMenuItem
                key={i}
                label={label}
                onOpenLvl3={() => {
                  setItem(item);
                  openLvl3();
                }}
                subItemGroups={subItemGroups}
                subItems={subItems}
                url={url}
              />
            );
          })}
        </ul>

        <div className={styles.iconsMenuLinks}>
          <div className={styles.wrap}>
            {items?.map(({ image, label, url }, i) => {
              if (!image?.node?.sourceUrl) return null;

              return (
                <div className={styles.item} key={i}>
                  <Link href={makeRelativeUrl(url)}>
                    <Image
                      alt={label}
                      height={25}
                      src={image?.node?.sourceUrl}
                      width={25}
                    />
                    {label}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <div className={clsx(styles.mainMenuLevel3, isLvl3Open && styles.open)}>
        <div className={styles.wrap}>
          <div className={styles.heading}>
            <div className={styles.left}>
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault();
                  closeLvl3();
                }}
              >
                <ArrowIcon /> Back
              </Link>
            </div>

            <div className={styles.right}>
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setIsLvl3Open(false);
                  setOpenLvl4(null);
                  onCloseLvl3 && onCloseLvl3();
                }}
              >
                <CloseIcon />
              </Link>
            </div>
          </div>

          {item && (
            <>
              <div className={styles.subHeading}>{item.label}</div>

              <div className={styles.allProductsLinks}>
                {item.subItems.map(({ label, subItems, url }, index) => (
                  <div
                    className={clsx(
                      styles.productMenuItem,
                      openLvl4 === index && styles.open,
                    )}
                    key={index}
                  >
                    <div
                      className={styles.menuRow}
                      onClick={() =>
                        setOpenLvl4(openLvl4 === index ? null : index)
                      }
                    >
                      <Link
                        className={styles.menuText}
                        href={makeRelativeUrl(url) || '#'}
                        onClick={e => e.stopPropagation()}
                      >
                        {label}
                      </Link>
                      <ArrowIcon />
                    </div>

                    {subItems && (
                      <div className={styles.mainMenuLevel4}>
                        {subItems.map(({ image, label, url }, i) => (
                          <div className={styles.menuProductBox} key={i}>
                            <div className={styles.left}>
                              <figure>
                                <Image
                                  alt="HSP"
                                  height={282}
                                  src={image?.node?.sourceUrl}
                                  width={1133}
                                />
                              </figure>
                            </div>

                            <div className={styles.right}>
                              <div className={styles.content}>
                                <div className={styles.leftSide}>
                                  <h3>{label}</h3>
                                </div>

                                <div className={styles.rightSide}>
                                  <Link href={makeRelativeUrl(url)}>
                                    View <ArrowForword />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
