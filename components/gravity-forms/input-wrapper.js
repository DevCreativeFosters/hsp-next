import clsx from 'clsx';
import styles from './input-wrapper.module.scss';

export default function InputWrapper({ oneOf, children }) {
  return (
    <div
      className={clsx(styles.wrapper, {
        [styles['width-1-of-2']]: oneOf === 2,
        [styles['width-1-of-3']]: oneOf === 3,
        [styles['width-1-of-4']]: oneOf === 4,
        [styles['width-1-of-5']]: oneOf === 5,
        [styles['width-1-of-6']]: oneOf === 6,
      })}
    >
      {children}
    </div>
  );
}
