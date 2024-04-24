import styles from './select-option.module.scss';

export default function SelectOption({
  handleSelectOption,
  label,
  prefix,
  selectedOption,
  suffix,
  value,
}) {
  return (
    <button
      aria-selected={Boolean(selectedOption === value)}
      className={styles.option}
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
