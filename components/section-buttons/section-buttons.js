import clsx from 'clsx';

import Button from '@components/button/button';

import styles from './section-buttons.module.scss';

export default function SectionButtons({
  alternatingLayout,
  buttons = [],
  children,
  className,
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
      {buttons?.map(
        ({ label, link, variant, withArrowForwardIcon, ...props }, index) => (
          <Button
            href={link?.url || link}
            key={index}
            target={link?.target || null}
            {...props}
            rightIcon={withArrowForwardIcon ? 'arrow-forward' : null}
            variant={variant[0]}
          >
            {label}
          </Button>
        ),
      )}
      {children}
    </div>
  );
}
