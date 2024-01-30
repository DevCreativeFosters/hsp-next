import AnimateHeight from 'react-animate-height';
import { getIcon } from '@lib/icons';
import { useCallback } from 'react';
import AccordionTrigger from './accordion-trigger';
import styles from './accordion-item.module.scss';
import clsx from 'clsx';

export default function AccordionItem({
  isOpen,
  onToggle,
  className,
  resetStyling = false,
  animationDuration = 300,
  triggerContent,
  children,
}) {
  const ExpandIcon = getIcon('expand-more-neutral');

  const handleKeyUp = useCallback(
    event => {
      if (event.key === 'Enter' || event.key === ' ') {
        onToggle();
      }
    },
    [onToggle],
  );

  return (
    <div
      className={clsx(
        styles.accordionItem,
        { [styles.active]: isOpen },
        { [styles.reset]: resetStyling },
        className,
      )}
    >
      <AccordionTrigger
        onClick={onToggle}
        onKeyUp={handleKeyUp}
        isOpen={isOpen}
        resetStyling={resetStyling}
      >
        {triggerContent}
        <div className={styles.arrow}>
          <ExpandIcon />
        </div>
      </AccordionTrigger>

      <AnimateHeight duration={animationDuration} height={isOpen ? 'auto' : 0}>
        <div className={styles.body}>{children}</div>
      </AnimateHeight>
    </div>
  );
}
