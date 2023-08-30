import StarRating from './star-rating';
import styles from './review.module.scss';

export default function Review({ score, name, text }) {
  return (
    <div className={styles.review}>
      <StarRating score={score} />
      <p className={styles.text}>{text}</p>
      <span className={styles.name}>{name}</span>
    </div>
  );
}
