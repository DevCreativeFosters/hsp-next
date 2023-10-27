'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useHasClass from '@hooks/useHasClass';
import { useIsMobile } from '@hooks/useIsMobile';
import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';
import { getIcon } from '@lib/icons';
import styles from './input.module.scss';

export default function Input({
  type,
  className,
  value = '',
  placeholder,
  label = '',
  name,
  required,
  icon,
  withResetButton,
  onClick,
  onChange = () => null,
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
    <>
      {label && (
        <label className={styles.label} htmlFor={`input-${name}`}>
          {label}
        </label>
      )}
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
          id={`input-${name}`}
          className={clsx(styles.input, {
            [styles.withIcon]: Icon,
            [styles.withReset]: withResetButton,
          })}
          type={type || 'text'}
          name={name}
          placeholder={placeholder}
          value={localValue}
          onChange={ev => onChange(ev.target.value)}
          required={required}
          {...props}
        />
        <label
          htmlFor={`fake-input-${name}`}
          className={styles.highInputLabel}
        />
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon />
          </div>
        )}
        {withResetButton && localValue && (
          <button
            className={styles.resetButton}
            onClick={ev => {
              ev.preventDefault();
              onChange('');
              mainInputRef.current.focus();
            }}
          ></button>
        )}
      </div>
    </>
  );
}
