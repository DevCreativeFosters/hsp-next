'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import styles from '@/styles/forms/select.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function Select({
  size = 'small',
  background = 'dark',
  errorMessage = '',
  placeholder = '',
  options = [],
  suffix = 'km',
  prefix = '',
  selected,
  onChange = () => null,
  ...props
}) {
  const [selectedValue, setSelectedValue] = useState(selected);
  const [isOpen, setOpen] = useState(false);
  const selectedOption = useMemo(
    () => options.find(option => option.value === selectedValue),
    [selectedValue],
  );

  const handleClickOutside = () => {
    setOpen(false);
  };

  const triggerRef = useClickOutside(handleClickOutside);

  const toggleDropdown = ev => {
    ev.stopPropagation();

    setOpen(prevState => !prevState);
  };

  const handleSelectOption = useCallback(
    value => () => {
      setSelectedValue(value);
      onChange(value);
    },
    [onChange],
  );

  return (
    <div className={styles.wrapper}>
      <div
        className={clsx(styles.inputWrapper, {
          [styles.small]: size === 'small',
          [styles.large]: size === 'large',
          [styles.isOpen]: isOpen,
        })}
      >
        <button
          ref={triggerRef}
          className={clsx(styles.trigger, {
            [styles.darkBackground]: background === 'dark',
            [styles.lightBackground]: background === 'light',
            [styles.error]: errorMessage,
            [styles.filled]: selectedValue,
          })}
          onClick={toggleDropdown}
          {...props}
        >
          <div>
            {prefix && selectedValue && (
              <span className={styles.suffixPrefix}>{prefix}</span>
            )}{' '}
            {selectedOption?.title || placeholder}{' '}
            {suffix && selectedValue && (
              <span className={styles.suffixPrefix}>{suffix}</span>
            )}
          </div>
          {isOpen ? (
            <i className={clsx('material-icon', styles.triggerIcon)}>
              expand_less
            </i>
          ) : (
            <i className={clsx('material-icon', styles.triggerIcon)}>
              expand_more
            </i>
          )}
        </button>
        <div
          className={clsx(styles.dropdown, { [styles.isOpen]: isOpen })}
          role="listbox"
          tabindex="0"
        >
          {options.map((option, index) => (
            <button
              key={index}
              className={styles.option}
              role="option"
              aria-selected={selectedOption}
              onClick={handleSelectOption(option.value)}
              tabIndex={0}
              data-value={option.value ? option.value : option.title}
            >
              {prefix && <span className={styles.suffixPrefix}>{prefix}</span>}{' '}
              {option.title}{' '}
              {suffix && <span className={styles.suffixPrefix}>{suffix}</span>}
            </button>
          ))}
        </div>
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}
