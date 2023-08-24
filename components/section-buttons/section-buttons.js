import clsx from 'clsx';
import Button from '@components/button';
import styles from './section-buttons.module.scss';

export default function SectionButtons({ buttons = [], alternatingLayout }) {
  if (!buttons.length) return;

  const breakRow = Math.ceil(buttons.length / 2);

  return (
    <div
      className={clsx(styles.buttons, {
        [styles.alternatingLayout]: alternatingLayout,
      })}
      style={
        alternatingLayout
          ? { '--alternating-layout-break-row': breakRow }
          : null
      }
    >
      {buttons.map(({ label, url, ...props }, index) => (
        <Button href={url} {...props} key={index}>
          {label}
        </Button>
      ))}
    </div>
  );
}
