import clsx from 'clsx';
import MobileMenuItem from './mobile-menu-item';
import styles from './mobile-menu.module.scss';

export default function MobileMenu({ items, isMenuActive }) {
  return (
    <nav
      className={clsx(styles.mobileMenu, { [styles.isActive]: isMenuActive })}
    >
      <ul className={styles.mobileMenuList}>
        {items?.map(({ label, url, subItems, subItemGroups }, i) => (
          <MobileMenuItem
            key={i}
            label={label}
            url={url}
            subItems={subItems}
            subItemGroups={subItemGroups}
          />
        ))}
      </ul>
    </nav>
  );
}
