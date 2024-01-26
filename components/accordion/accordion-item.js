import AnimateHeight from 'react-animate-height';
import { getIcon } from '@lib/icons';
import { useCallback } from 'react';
import styles from './accordion-item.module.scss';
import clsx from 'clsx';

export default function AccordionItem({
  title,
  children,
  isOpen,
  onToggle,
  animationDuration = 300,
  titleTag: TitleTag = 'div',
  titleStyles = {},
  serialNo,
  date,
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
    <div className={clsx(styles.accordionItem, { [styles.active]: isOpen })}>
      <div
        className={styles.accordionItemButton}
        role="button"
        tabIndex={0}
        onKeyUp={handleKeyUp}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <TitleTag className={styles.accordionItemText} style={titleStyles}>
          {title && <span>{title}</span>}
          {serialNo && <span>{serialNo}</span>}
          {date && <time>{date}</time>}
        </TitleTag>
        <div className={styles.accordionItemIndicator}>
          <ExpandIcon />
        </div>
      </div>
      <AnimateHeight duration={animationDuration} height={isOpen ? 'auto' : 0}>
        <div className={styles.accordionItemBody}>{children}</div>
      </AnimateHeight>
    </div>
  );
}
