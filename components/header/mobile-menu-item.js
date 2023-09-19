import { useRef, useState, useCallback } from 'react';
import AnimateHeight from 'react-animate-height';
import clsx from 'clsx';
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
        {subItems.map(({ url, label, special }, j) => (
          <li key={j}>
            <Button
              href={url}
              size="large"
              variant="tertiary"
              background="dark"
              fontStyle={{
                fontFamily: 'var(--font-primary)',
                fontSize: '20px',
                fontWeight: 400,
                ...(special && { color: 'var(--color-primary-100)' }),
              }}
            >
              {label}
            </Button>
          </li>
        ))}
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
              <div key={index}>
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
