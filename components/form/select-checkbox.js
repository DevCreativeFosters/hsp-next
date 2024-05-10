import { useId } from 'react';

import styles from './select-checkbox.module.scss';

export default function SelectCheckbox({
  handleSelectCheckbox,
  label,
  selectedCheckboxes,
  value,
}) {
  const selected = selectedCheckboxes.map(selected => selected.value);
  const id = useId();

  return (
    <div className={styles.wrapper}>
      <input
        checked={selected.includes(value)}
        className={styles.checkbox}
        id={id}
        onChange={() => handleSelectCheckbox(value, label)}
        type="checkbox"
        value={value !== undefined ? value : label}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
