import { useCallback, useRef, useState } from 'react';

import clsx from 'clsx';

import Button from '@components/button/button';

import ArrowIcon from '@assets/icons/arrow-next.svg';
import LinkIcon from '@assets/icons/link-sq-icon.svg';

import styles from './mobile-menu-item.module.scss';

export default function MobileMenuItem({
  label,
  onOpenLvl3,
  subItemGroups,
  subItems,
  url,
}) {
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);
  const containerRef = useRef();

  const renderSubItems = useCallback(subItems => {
    if (!subItems?.length) return null;

    return (
      <ul className={styles.mobileMenuSubList}>
        {subItems?.map((subItem, j) => {
          const fontStyle = {
            fontFamily: 'var(--font-primary)',
            fontSize: '20px',
            fontWeight: 400,
            marginLeft: 0,
          };

          return (
            <li key={subItem.url + j}>
              <Button
                background="dark"
                className={
                  subItem.subItems.length > 0
                    ? styles.menuItemLabel
                    : styles.menuSubItem
                }
                href={subItem.url}
                size="small"
                style={subItem.special ? (j === 0 ? { ...fontStyle } : {}) : {}}
                variant="tertiary"
              >
                {subItem.label}
              </Button>
            </li>
          );
        })}
      </ul>
    );
  }, []);

  const hasChildren = subItems?.length > 0 || subItemGroups?.length > 0;

  // const toggleSubItems = useCallback(() => {
  //   // setSubMenuVisible(!isSubMenuVisible);

  //   if (hasChildren && onOpenLvl3) {
  //     onOpenLvl3();
  //   }

  // }, [isSubMenuVisible, hasChildren, onOpenLvl3]);
  // const toggleSubItems = useCallback(() => {
  //   onOpenLvl3();
  // }, []);

  return (
    <li
      className={clsx(
        styles.mobileMenuItem,
        hasChildren ? styles.withSubItems : null,
      )}
    >
      <Button
        background="dark"
        href={!hasChildren ? url : undefined}
        onClick={hasChildren ? onOpenLvl3 : undefined}
        size="large"
        variant="tertiary"
      >
        {label} {hasChildren ? <ArrowIcon /> : <LinkIcon />}
      </Button>

      {/* {hasChildren && (
        <AnimateHeight duration={300} height={isSubMenuVisible ? 'auto' : 0}>
          <div ref={containerRef}>
            {renderSubItems(subItems)}

            {subItemGroups?.map(({ label, subItems }, index) => (
              <div key={label + index}>
                <div className={styles.groupLabel}>{label}</div>
                {renderSubItems(subItems)}
              </div>
            ))}
          </div>
        </AnimateHeight>
      )} */}
    </li>
  );
}
