'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';

import useHasClass from '@hooks/useHasClass';
import { useIsMobile } from '@hooks/useIsMobile';

import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';
import { getIcon } from '@lib/icons';

import styles from './store-locator-input.module.scss';

export default function Input({
  className,
  disabled,
  icon,
  label = '',
  name,
  onChange = () => null,
  onClick,
  placeholder,
  required,
  type,
  value = '',
  withResetButton,
  ...props
}) {
  const Icon = getIcon(icon);
  const [localValue, setLocalValue] = useState(value);
  const mainInputRef = useRef(null);
  const isFullScreen = useHasClass(STORE_LOCATOR_FULLSCREEN);
  const isMobile = useIsMobile();

  const { setShowLocationError } = useContext(StoreLocatorContext);

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
          className={styles.highInput}
          id={`fake-input-${name}`}
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
          type="text"
        />
        <input
          className={clsx(styles.input, {
            [styles.withIcon]: Icon,
            [styles.withReset]: withResetButton,
          })}
          disabled={disabled}
          id={`input-${name}`}
          name={name}
          onChange={ev => onChange(ev.target.value)}
          placeholder={placeholder}
          ref={mainInputRef}
          required={required}
          type={type || 'text'}
          value={localValue}
          {...props}
        />
        <label
          className={styles.highInputLabel}
          htmlFor={`fake-input-${name}`}
        />
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon />
          </div>
        )}
        {withResetButton && localValue && (
          <button
            className={styles.resetButton}
            disabled={disabled}
            onClick={ev => {
              setShowLocationError(false);
              ev.preventDefault();
              onChange('');
              mainInputRef.current.focus();
            }}
          />
        )}
      </div>
    </>
  );
}
