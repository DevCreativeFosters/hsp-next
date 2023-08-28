import { useCallback, useEffect, useRef, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import clsx from 'clsx';
import { useClickOutside } from '@hooks/useClickOutside';
import Button from '@components/button';
import { getIcon } from '@lib/icons';
import styles from './custom-select.module.scss';

const MAX_ITEMS_IN_ONE_COL_LAYOUT = 5; // keep in sync with SCSS

export default function CustomSelect({
  options,
  selectedValue,
  placeholder,
  disabled,
  onSelect,
  fRef,
}) {
  const ExpandIcon = getIcon('expand-more-neutral');
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(selectedValue);
  const selectedOption = options.find(({ value }) => {
    const comparedValue =
      selectedValue === undefined ? localValue : selectedValue;
    return value === comparedValue;
  });

  const onOptionSelect = useCallback(
    value => {
      onSelect(value);
      setLocalValue(value);
      setIsOpen(false);
    },
    [onSelect],
  );

  const dropdownRef = useRef();

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useClickOutside(handleClickOutside, [dropdownRef]);

  const breakRow = Math.max(
    MAX_ITEMS_IN_ONE_COL_LAYOUT,
    Math.ceil(options.length / 2),
  );

  useEffect(
    function openDropdownOnExternalEvent() {
      fRef.current.addEventListener('open-custom-select', () => {
        setIsOpen(true);
      });
    },
    [fRef],
  );

  return (
    <div
      className={clsx(styles.container, {
        [styles.isDisabled]: disabled,
      })}
      ref={fRef}
    >
      <div
        className={clsx(styles.currentValue, {
          [styles.isPlaceholder]: !selectedValue,
        })}
        onClick={() => setIsOpen(true)}
      >
        <div className={styles.allValuesStretchContainer}>
          <div className={styles.stretchOption}>{placeholder}</div>
          {options.map(({ label, value }) => (
            <div className={styles.stretchOption} key={value}>
              {label || value}
            </div>
          ))}
        </div>
        <div className={styles.displayedValue}>
          <div>{selectedOption?.label || selectedValue || placeholder}</div>
          <div className={styles.indicator}>
            <ExpandIcon />
          </div>
        </div>
      </div>

      <div className={styles.dropdownContainer} ref={dropdownRef}>
        <AnimateHeight height={isOpen ? 'auto' : 0} duration={150}>
          <div
            className={clsx(
              styles.dropdownInner,
              styles[`number-of-items-${options.length}`],
            )}
            style={{ '--break-row': breakRow, '--items': options.length }}
          >
            {options.map(({ label, value }, index) => (
              <Button
                key={value + index}
                size="xsmall"
                variant="tertiary"
                onClick={() => onOptionSelect(value)}
              >
                {label || value}
              </Button>
            ))}
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
}
