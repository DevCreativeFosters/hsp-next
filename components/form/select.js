'use client';

import Input from '@components/form/input';
import { useState, useCallback, useMemo, useRef, useId } from 'react';
import AnimateHeight from 'react-animate-height';
import clsx from 'clsx';
import { useClickOutside } from '@hooks/useClickOutside';
import ExpandMoreNeutral from '@assets/icons/expand-more-neutral.svg';
import styles from './select.module.scss';

const MIN_RESULTS_TO_ENABLE_SEARCH = 20;

export default function Select({
  className,
  id = '',
  size = 'small',
  background = 'dark',
  label = '',
  errorMessage = '',
  placeholder = '',
  options = [],
  prefix = '',
  suffix = '',
  value,
  required = null,
  dropdownInDocumentFlow,
  onChange = () => null,
  onClick = () => null,
  ...props
}) {
  const searchInputRef = useRef();
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectedOption = useMemo(
    () => options.find(option => value !== undefined && option.value === value),
    [options, value],
  );

  const elementId = useId();

  const handleClickOutside = () => {
    setOpen(false);
  };

  const triggerRef = useRef();
  useClickOutside(handleClickOutside, [triggerRef]);

  const toggleDropdown = useCallback(ev => {
    ev.stopPropagation();

    setOpen(prevState => {
      const newState = !prevState;
      if (newState) {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
      return newState;
    });
  }, []);

  const handleSelectOption = useCallback(
    (value, label) => {
      onChange(value, label);
      setOpen(false);
    },
    [onChange],
  );

  const isSearchVisible =
    options.length >= MIN_RESULTS_TO_ENABLE_SEARCH && isOpen;

  const isPlaceholder =
    !selectedOption?.label && selectedOption?.value === undefined;

  return (
    <div className={clsx(styles.wrapperOuter, className)}>
      <div
        ref={triggerRef}
        className={clsx(styles.wrapperInner, {
          [styles.small]: size === 'small',
          [styles.large]: size === 'large',
          [styles.isOpen]: isOpen,
        })}
      >
        {label && (
          <label htmlFor={elementId} className={styles.label}>
            {label}
          </label>
        )}
        <button
          id={elementId}
          type="button"
          className={clsx(styles.trigger, {
            [styles.darkBackground]: background === 'dark',
            [styles.lightBackground]: background === 'light',
            [styles.error]: errorMessage,
            [styles.filled]: value,
          })}
          {...props}
          onClick={ev => {
            toggleDropdown(ev);
            onClick();
          }}
        >
          {!isSearchVisible && (
            <>
              {isPlaceholder ? (
                <div className={styles.placeholder}>{placeholder}</div>
              ) : (
                <div className={styles.value}>
                  {prefix && (
                    <span className={styles.prefixSuffix}>{prefix} </span>
                  )}
                  {selectedOption.label || selectedOption.value}
                  {suffix && (
                    <span className={styles.prefixSuffix}> {suffix}</span>
                  )}
                </div>
              )}
            </>
          )}

          {options.map(({ label, value }, index) => (
            <div
              className={clsx(styles.value, styles.forStretchOnly)}
              key={index}
              data-value={value !== undefined ? value : label}
            >
              {prefix && <span className={styles.prefixSuffix}>{prefix} </span>}
              {label || value}
              {suffix && <span className={styles.prefixSuffix}> {suffix}</span>}
            </div>
          ))}

          <span className={clsx(styles.pivot, { [styles.reversed]: isOpen })}>
            <ExpandMoreNeutral />
          </span>
        </button>

        {isSearchVisible && (
          <div
            className={styles.searchContainer}
            onClick={ev => {
              ev.stopPropagation();
              ev.preventDefault();
            }}
          >
            <Input
              ref={searchInputRef}
              placeholder="Search..."
              background="dark"
              value={search}
              onChange={ev => {
                setSearch(ev.target.value);
              }}
            />
          </div>
        )}

        <select
          name={`fake_${props.name}`}
          className={styles.realSelect}
          required={required}
          value={value || ''}
          onChange={() => {}}
        >
          {value ? <option>{value}</option> : null}
        </select>

        <div
          className={clsx(styles.dropdownContainer, {
            [styles.isInDocumentFlow]: dropdownInDocumentFlow,
          })}
        >
          <AnimateHeight
            height={isOpen ? 'auto' : 0}
            duration={200}
            contentClassName={styles.animateHeightContainer}
          >
            <div
              className={clsx(styles.dropdown, {
                [styles.isOpen]: isOpen,
              })}
              role="listbox"
              tabIndex="0"
            >
              {options
                .filter(({ label, value }) => {
                  const labelNormalized = label.toLowerCase();
                  const valueNormalized = value.toLowerCase();
                  const searchNormalized = search.toLowerCase();
                  if (searchNormalized) {
                    return (
                      labelNormalized.includes(searchNormalized) ||
                      valueNormalized.includes(searchNormalized)
                    );
                  }
                  return true;
                })
                .map(({ label, value }, index) => (
                  <button
                    key={index}
                    className={styles.option}
                    type="button"
                    role="option"
                    aria-selected={Boolean(selectedOption)}
                    onClick={() => handleSelectOption(value, label)}
                    tabIndex={0}
                    data-value={value !== undefined ? value : label}
                  >
                    {prefix && (
                      <span className={styles.prefixSuffix}>{prefix} </span>
                    )}
                    {label || value}
                    {suffix && (
                      <span className={styles.prefixSuffix}> {suffix}</span>
                    )}
                  </button>
                ))}
            </div>
          </AnimateHeight>
        </div>
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}
