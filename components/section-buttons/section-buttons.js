import clsx from 'clsx';
import Button from '@components/button/button';
import styles from './section-buttons.module.scss';

export default function SectionButtons({
  buttons = [],
  alternatingLayout,
  className,
  children,
}) {
  const breakRow = Math.ceil(buttons?.length / 2);

  return (
    <div
      className={clsx(styles.buttons, className, {
        [styles.alternatingLayout]: alternatingLayout,
      })}
      style={
        alternatingLayout
          ? { '--alternating-layout-break-row': breakRow }
          : null
      }
    >
      {buttons.map(({ label, link, withArrowForwardIcon, ...props }, index) => (
        <Button
          key={index}
          href={link?.url || link}
          target={link?.target || null}
          {...props}
          rightIcon={withArrowForwardIcon ? 'arrow-forward' : null}
        >
          {label}
        </Button>
      ))}
      {children}
    </div>
  );
}
