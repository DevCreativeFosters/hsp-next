import CloseLarge from '@assets/icons/close-large.svg';
import styles from './youtube-close-button.module.scss';

export function YoutubeCloseButton({ label, onClick = () => null }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.icon}>
        <CloseLarge />
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  );
}
