'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useClickOutside } from '@hooks/useClickOutside';
import ExpandMoreNeutral from '@assets/material-icons/expand-more-neutral.svg';
import styles from '@styles/forms/select.module.scss';

export default function Select({
  size = 'small',
  background = 'dark',
  errorMessage = '',
  placeholder = '',
  options = [],
  prefix = '',
  suffix = '',
  selected,
  onChange = () => null,
  onClick = () => null,
  ...props
}) {
  const [selectedValue, setSelectedValue] = useState(selected);
  const [isOpen, setOpen] = useState(false);
  const selectedOption = useMemo(
    () => options.find(option => option.value === selectedValue),
    [options, selectedValue],
  );

  const handleClickOutside = () => {
    setOpen(false);
  };

  const triggerRef = useRef();
  useClickOutside(handleClickOutside, [triggerRef]);

  const toggleDropdown = ev => {
    ev.stopPropagation();

    setOpen(prevState => !prevState);
  };

  const handleSelectOption = useCallback(
    value => () => {
      setSelectedValue(value);
      onChange(value);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <div className={styles.wrapperOuter}>
      <div
        className={clsx(styles.wrapperInner, {
          [styles.small]: size === 'small',
          [styles.large]: size === 'large',
          [styles.isOpen]: isOpen,
        })}
      >
        <button
          ref={triggerRef}
          type="button"
          className={clsx(styles.trigger, {
            [styles.darkBackground]: background === 'dark',
            [styles.lightBackground]: background === 'light',
            [styles.error]: errorMessage,
            [styles.filled]: selectedValue,
          })}
          {...props}
          onClick={ev => {
            onClick();
            toggleDropdown(ev);
          }}
        >
          {selectedOption?.label || selectedOption?.value !== undefined ? (
            <div>
              {prefix && <span className={styles.prefixSuffix}>{prefix} </span>}
              {selectedOption.label || selectedOption.value}
              {suffix && <span className={styles.prefixSuffix}> {suffix}</span>}
            </div>
          ) : (
            placeholder
          )}

          <div className={clsx(styles.pivot, { [styles.reversed]: isOpen })}>
            <ExpandMoreNeutral />
          </div>
        </button>
        <div
          className={clsx(styles.dropdown, { [styles.isOpen]: isOpen })}
          role="listbox"
          tabIndex="0"
        >
          {options.map(({ label, value }, index) => (
            <button
              key={index}
              className={styles.option}
              type="button"
              role="option"
              aria-selected={Boolean(selectedOption)}
              onClick={handleSelectOption(value)}
              tabIndex={0}
              data-value={value !== undefined ? value : label}
            >
              {prefix && <span className={styles.prefixSuffix}>{prefix} </span>}
              {value}
              {suffix && <span className={styles.prefixSuffix}> {suffix}</span>}
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
