import styles from './title-and-description.module.scss';

export default function TitleAndDescription({ title, description }) {
  if (title) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    );
  }
}
