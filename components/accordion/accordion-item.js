import { useCallback } from 'react';

import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';

import { getIcon } from '@lib/icons';

import styles from './accordion-item.module.scss';
import AccordionTrigger from './accordion-trigger';

export default function AccordionItem({
  animationDuration = 300,
  children,
  className,
  isOpen,
  onToggle,
  resetStyling = false,
  triggerContent,
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
        isOpen={isOpen}
        onClick={onToggle}
        onKeyUp={handleKeyUp}
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
