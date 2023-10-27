import styles from './switch.module.scss';

export default function Switch({ label = '' }) {
  return (
    <div>
      <label className={styles.label}>
        <input type="checkbox" className={styles.input} />
        <div className={styles.switch}></div>
        <span className={styles.labelText}>{label}</span>
      </label>
    </div>
  );
}
