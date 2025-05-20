import { useEffect, useState } from 'react';

import clsx from 'clsx';

import styles from './select-option.module.scss';

export default function SelectOption({
  handleSelectOption,
  isOpen = false,
  label,
  mobileScrollAnimation = false,
  prefix,
  selectedOption,
  suffix,
  value,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(isOpen && mobileScrollAnimation);
  }, [isOpen, mobileScrollAnimation]);

  return (
    <button
      aria-selected={selectedOption === value}
      className={clsx(styles.option, {
        [styles.animateScroll]: mobileScrollAnimation && isAnimating,
      })}
      data-value={value !== undefined ? value : label}
      onClick={() => handleSelectOption(value, label)}
      role="option"
      tabIndex={0}
      type="button"
    >
      {prefix && <span className={styles.prefixSuffix}>{prefix} </span>}
      {label || value}
      {suffix && <span className={styles.prefixSuffix}> {suffix}</span>}
    </button>
  );
}
