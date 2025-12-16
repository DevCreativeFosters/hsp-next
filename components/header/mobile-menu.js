import clsx from 'clsx';

import { useUserContext } from '@contexts/user';

import Button from '@components/button/button';

import MobileMenuItem from './mobile-menu-item';
import styles from './mobile-menu.module.scss';

export default function MobileMenu({ isMenuActive, items }) {
  const { user } = useUserContext();
  return (
    <nav
      className={clsx(styles.mobileMenu, { [styles.isActive]: isMenuActive })}
    >
      <ul className={styles.mobileMenuList}>
        <li className={styles.profileButton}>
          <Button
            background="dark"
            href={user?.id ? `/account/${user?.role}` : '/register'}
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
