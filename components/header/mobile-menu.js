import clsx from 'clsx';

import MobileMenuItem from './mobile-menu-item';
import styles from './mobile-menu.module.scss';

export default function MobileMenu({ isMenuActive, items }) {
  return (
    <nav
      className={clsx(styles.mobileMenu, { [styles.isActive]: isMenuActive })}
    >
      <ul className={styles.mobileMenuList}>
        {items?.map(({ label, subItemGroups, subItems, url }, i) => (
          <MobileMenuItem
            key={i}
            label={label}
            subItemGroups={subItemGroups}
            subItems={subItems}
            url={url}
          />
        ))}
      </ul>
    </nav>
  );
}
