import clsx from 'clsx';

import styles from './accordion-trigger.module.scss';

export default function AccordionTrigger({
  children,
  className,
  isOpen,
  isStickyOnMobile = false,
  onClick,
  onKeyUp,
  resetStyling,
  stickyTopOffset,
}) {
  const customStyle = {};
  if (isStickyOnMobile && stickyTopOffset !== undefined) {
    customStyle.top =
      typeof stickyTopOffset === 'number'
        ? `${stickyTopOffset}px`
        : stickyTopOffset;
  }

  return (
    <div
      aria-expanded={isOpen}
      className={clsx(
        styles.button,
        styles.accordionTrigger,
        { [styles.reset]: resetStyling },
        { [styles.isStickyOnMobile]: isStickyOnMobile },
        className,
      )}
      onClick={onClick}
      onKeyUp={onKeyUp}
      role="button"
      style={customStyle}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
