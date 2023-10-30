import styles from './switch.module.scss';

export default function Switch({ label = '', state, disabled, onChange }) {
  return (
    <div>
      <label className={styles.label}>
        <input
          type="checkbox"
          className={styles.input}
          value={state}
          disabled={disabled}
          onChange={onChange}
        />
        <div className={styles.switch}></div>
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
}
