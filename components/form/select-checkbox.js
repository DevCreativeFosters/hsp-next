import styles from './select-checkbox.module.scss';

export default function SelectCheckbox({
  handleSelectCheckbox,
  index,
  label,
  selectedCheckboxes,
  value,
}) {
  const selected = selectedCheckboxes.map(selected => selected.value);
  const id = `${index}_${label}_${value}`;

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
