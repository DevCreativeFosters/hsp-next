import styles from './accordion-trigger.module.scss';
import clsx from 'clsx';

export default function AccordionTrigger({
  className,
  resetStyling,
  isOpen,
  onClick,
  onKeyUp,
  children,
}) {
  return (
    <div
      className={clsx(
        styles.button,
        { [styles.reset]: resetStyling },
        className,
      )}
      role="button"
      tabIndex={0}
      onKeyUp={onKeyUp}
      onClick={onClick}
      aria-expanded={isOpen}
    >
      {children}
    </div>
  );
}
