import { useCallback, useRef, useState } from 'react';

import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';

import Button from '@components/button/button';

import styles from './mobile-menu-item.module.scss';

export default function MobileMenuItem({
  label,
  url,
  subItems,
  subItemGroups,
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
                href={subItem.url}
                size="small"
                variant="tertiary"
                background="dark"
                style={subItem.special ? (j === 0 ? { ...fontStyle } : {}) : {}}
                className={
                  subItem.subItems.length > 0
                    ? styles.menuItemLabel
                    : styles.menuSubItem
                }
              >
                {subItem.label}
              </Button>
              {subItem.subItems?.map((item, index) => (
                <div
                  className={styles.submenuItemsMobile}
                  key={item.url + index}
                >
                  <Button
                    href={item.url}
                    size="small"
                    variant="senary"
                    background="dark"
                    style={{ ...fontStyle }}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    );
  }, []);

  const toggleSubItems = useCallback(() => {
    setSubMenuVisible(!isSubMenuVisible);
  }, [isSubMenuVisible]);

  const hasChildren = subItems?.length > 0 || subItemGroups?.length > 0;

  return (
    <li
      className={clsx(
        styles.mobileMenuItem,
        hasChildren ? styles.withSubItems : null,
      )}
    >
      <Button
        href={url}
        size="large"
        variant="tertiary"
        background="dark"
        toggleable={hasChildren ? 'primary' : null}
        isToggled={isSubMenuVisible}
        onClick={url ? null : toggleSubItems}
      >
        {label}
      </Button>
      {hasChildren && (
        <AnimateHeight height={isSubMenuVisible ? 'auto' : 0} duration={300}>
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
      )}
    </li>
  );
}
