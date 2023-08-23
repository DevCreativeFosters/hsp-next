import Button from '@components/button';
import styles from './section-buttons.module.scss';

export default function SectionButtons({ buttons = [] }) {
  if (!buttons.length) return;

  return (
    <div className={styles.buttons}>
      {buttons.map(({ label, url, ...props }, index) => (
        <Button href={url} {...props} key={index}>
          {label}
        </Button>
      ))}
    </div>
  );
}
