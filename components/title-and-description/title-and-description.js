import styles from './title-and-description.module.scss';

export default function TitleAndDescription({ title, description }) {
  if (title || description) {
    return (
      <section className={styles.section}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {description && <p className={styles.description}>{description}</p>}
      </section>
    );
  }
  return null;
}
