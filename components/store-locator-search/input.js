'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useHasClass from '@hooks/useHasClass';
import { useIsMobile } from '@hooks/useIsMobile';
import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';
import { getIcon } from '@lib/icons';
import styles from '@components/store-locator-search/input.module.scss';

export default function Input({
  type,
  className,
  value = '',
  placeholder,
  name,
  required,
  icon,
  onClick,
  ...props
}) {
  const Icon = getIcon(icon);
  const [localValue, setLocalValue] = useState(value);
  const mainInputRef = useRef(null);
  const isFullScreen = useHasClass(STORE_LOCATOR_FULLSCREEN);
  const isMobile = useIsMobile();

  useEffect(
    function syncValue() {
      setLocalValue(value);
    },
    [value],
  );

  return (
    <div className={clsx(styles.wrapper, className)}>
      <input
        type="text"
        id={`fake-input-${name}`}
        className={styles.highInput}
        onFocus={() => {
          if (isFullScreen || !isMobile) {
            mainInputRef.current.focus();
          } else {
            setTimeout(() => {
              mainInputRef.current.focus();
            }, 300);
          }
          if (onClick) {
            onClick();
          }
        }}
      />
      <input
        ref={mainInputRef}
        className={clsx(styles.input, { [styles.withIcon]: Icon })}
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        value={localValue}
        onChange={ev => setLocalValue(ev.target.value)}
        required={required}
        {...props}
      />
      <label htmlFor={`fake-input-${name}`} className={styles.eventLabel} />
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon />
        </div>
      )}
    </div>
  );
}
