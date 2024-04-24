import clsx from 'clsx';

import styles from './accordion-trigger.module.scss';

export default function AccordionTrigger({
  children,
  className,
  isOpen,
  onClick,
  onKeyUp,
  resetStyling,
}) {
  return (
    <div
      aria-expanded={isOpen}
      className={clsx(
        styles.button,
        { [styles.reset]: resetStyling },
        className,
      )}
      onClick={onClick}
      onKeyUp={onKeyUp}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
