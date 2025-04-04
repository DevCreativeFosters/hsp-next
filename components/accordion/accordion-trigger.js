import { useCallback, useMemo, useRef, useState } from 'react';

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
  const customStyle = useMemo(() => {
    if (isStickyOnMobile && stickyTopOffset !== undefined) {
      return {
        '--accordion-trigger-sticky-top':
          typeof stickyTopOffset === 'number'
            ? `${stickyTopOffset}px`
            : stickyTopOffset,
      };
    }
  }, [isStickyOnMobile, stickyTopOffset]);

  const [isCurrentlySticky, setIsCurrentlySticky] = useState(false);

  const monitorRef = useRef(null);
  const monitorStateRef = useRef({
    first: false,
    second: false,
  });

  const onMonitorRender = useCallback(el => {
    if (!el) return;

    if (!monitorRef.current) {
      monitorRef.current = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const { dataset } = entry.target;
          const { type } = dataset;

          monitorStateRef.current[type] = entry.isIntersecting;
        });

        setIsCurrentlySticky(
          !monitorStateRef.current.first && monitorStateRef.current.second,
        );
      });
    }

    monitorRef.current.observe(el);

    return () => {
      monitorRef.current.unobserve(el);
    };
  }, []);

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
      {isOpen && isStickyOnMobile && (
        <>
          <div
            className={clsx(styles.monitor, styles.first)}
            data-type="first"
            ref={onMonitorRender}
          />
          <div
            className={clsx(styles.monitor, styles.second)}
            data-type="second"
            ref={onMonitorRender}
          />
          <div
            className={clsx(styles.belowVehiclePickerBar, {
              [styles.isCurrentlySticky]: isCurrentlySticky,
            })}
          />
        </>
      )}
      {children}
    </div>
  );
}
