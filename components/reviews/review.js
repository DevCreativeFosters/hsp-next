import styles from './review.module.scss';
import StarRating from './star-rating';

export default function Review({ name, score, text }) {
  return (
    <div className={styles.review}>
      <StarRating score={score} />
      <p className={styles.text}>{text}</p>
      <span className={styles.name}>{name}</span>
    </div>
  );
}
