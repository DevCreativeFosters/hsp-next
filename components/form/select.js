'use client';

import { Fragment, useCallback, useId, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';

import { useClickOutside } from '@hooks/useClickOutside';

import Input from '@components/form/input';
import SelectCheckbox from '@components/form/select-checkbox';
import SelectOption from '@components/form/select-option';

import ExpandMoreNeutral from '@assets/icons/expand-more-neutral.svg';

import styles from './select.module.scss';

const MIN_RESULTS_TO_ENABLE_SEARCH = 20;

export default function Select({
  background = 'dark',
  className,
  dropdownInDocumentFlow,
  errorMessage = '',
  id = '',
  label = '',
  multiple = false,
  onChange = () => null,
  onClick = () => null,
  options = [],
  placeholder = '',
  prefix = '',
  required = null,
  size = 'small',
  suffix = '',
  value,
  ...props
}) {
  const searchInputRef = useRef();
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectedOption = useMemo(
    () =>
      !multiple
        ? options.find(option => value !== undefined && option.value === value)
        : null,
    [multiple, options, value],
  );

  const selectedCheckboxes = useMemo(
    () =>
      multiple && value
        ? options.filter(option => value.includes(option.value))
        : [],
    [multiple, options, value],
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
      if (!multiple) {
        setOpen(false);
      }
    },
    [multiple, onChange],
  );

  const isSearchVisible =
    options.length >= MIN_RESULTS_TO_ENABLE_SEARCH && isOpen;

  const isPlaceholder = multiple
    ? !value?.length
    : !selectedOption?.label && selectedOption?.value === undefined;

  return (
    <div className={clsx(styles.wrapperOuter, className)}>
      <div
        className={clsx(styles.wrapperInner, {
          [styles.small]: size === 'small',
          [styles.large]: size === 'large',
          [styles.isOpen]: isOpen,
        })}
        ref={triggerRef}
      >
        {label && (
          <label className={styles.label} htmlFor={elementId}>
            {label}
          </label>
        )}
        <button
          className={clsx(styles.trigger, {
            [styles.darkBackground]: background === 'dark',
            [styles.lightBackground]: background === 'light',
            [styles.error]: errorMessage,
            [styles.filled]: value,
          })}
          id={elementId}
          type="button"
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

                  <>
                    {multiple ? (
                      selectedCheckboxes.map(({ label, value }, index) =>
                        index > 0 ? `, ${label || value}` : label || value,
                      )
                    ) : (
                      <>{selectedOption.label || selectedOption.value}</>
                    )}
                    {suffix && (
                      <span className={styles.prefixSuffix}> {suffix}</span>
                    )}
                  </>
                </div>
              )}
            </>
          )}

          {options.map(({ label, value }, index) => (
            <div
              className={clsx(styles.value, styles.forStretchOnly)}
              data-value={value !== undefined ? value : label}
              key={index}
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
              background="dark"
              onChange={ev => {
                setSearch(ev.target.value);
              }}
              placeholder="Search..."
              ref={searchInputRef}
              value={search}
            />
          </div>
        )}

        <select
          className={styles.realSelect}
          multiple={multiple}
          name={props.name ? `fake_${props.name}` : null}
          onChange={() => {}}
          required={required}
          value={multiple ? [] : value || ''}
        >
          {value ? <option>{value}</option> : null}
        </select>

        <div
          className={clsx(styles.dropdownContainer, {
            [styles.isInDocumentFlow]: dropdownInDocumentFlow,
          })}
        >
          <AnimateHeight
            contentClassName={styles.animateHeightContainer}
            duration={200}
            height={isOpen ? 'auto' : 0}
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
                  const labelNormalized = label?.toLowerCase();
                  const valueNormalized = value?.toLowerCase();
                  const searchNormalized = search?.toLowerCase();
                  if (searchNormalized) {
                    return (
                      labelNormalized.includes(searchNormalized) ||
                      valueNormalized.includes(searchNormalized)
                    );
                  }
                  return true;
                })
                .map(({ label, value }, index) => (
                  <Fragment key={index}>
                    {multiple ? (
                      <SelectCheckbox
                        handleSelectCheckbox={handleSelectOption}
                        index={index}
                        label={label}
                        selectedCheckboxes={selectedCheckboxes}
                        value={value}
                      />
                    ) : (
                      <SelectOption
                        handleSelectOption={handleSelectOption}
                        label={label}
                        prefix={prefix}
                        selectedOption={selectedOption}
                        suffix={suffix}
                        value={value}
                      />
                    )}
                  </Fragment>
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
