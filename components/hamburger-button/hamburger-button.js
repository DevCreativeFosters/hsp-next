import clsx from 'clsx';
import styles from './hamburger-button.module.scss';

export default function HamburgerButton({ isActive, onClick = () => null }) {
  return (
    <button
      type="button"
      aria-label="Menu Toggle"
      className={clsx(styles.button, { [styles.isActive]: isActive })}
      onClick={onClick}
    >
      <span className={styles.bars}>
        <span className={clsx(styles.bar, styles.top)} />
        <span className={clsx(styles.bar, styles.middle)} />
        <span className={clsx(styles.bar, styles.bottom)} />
      </span>
    </button>
  );
}
