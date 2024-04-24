import styles from './switch.module.scss';

export default function Switch({ disabled, label = '', onChange, state }) {
  return (
    <div>
      <label className={styles.label}>
        <input
          className={styles.input}
          disabled={disabled}
          onChange={onChange}
          type="checkbox"
          value={state}
        />
        <div className={styles.switch}></div>
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
}
