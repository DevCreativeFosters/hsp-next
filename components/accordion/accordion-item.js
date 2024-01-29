import AnimateHeight from 'react-animate-height';
import { getIcon } from '@lib/icons';
import { useCallback } from 'react';
import styles from './accordion-item.module.scss';
import clsx from 'clsx';

export default function AccordionItem({
  isOpen,
  onToggle,
  className,
  animationDuration = 300,
  titleTag: TitleTag = 'div',
  text,
  id,
  date,
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
        className,
      )}
    >
      <div
        className={styles.button}
        role="button"
        tabIndex={0}
        onKeyUp={handleKeyUp}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={text}
      >
        <div className={styles.wrapper}>
          <TitleTag className={styles.title}>
            {text && <span className={styles.text}>{text}</span>}
            {id && <span className={styles.id}> {id}</span>}
          </TitleTag>
          {date && <time className={styles.date}>{date}</time>}
        </div>

        <div className={styles.arrow}>
          <ExpandIcon />
        </div>
      </div>
      <AnimateHeight duration={animationDuration} height={isOpen ? 'auto' : 0}>
        <div className={styles.body}>{children}</div>
      </AnimateHeight>
    </div>
  );
}
