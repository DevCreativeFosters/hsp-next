import clsx from 'clsx';

import styles from './review.module.scss';
import StarRating from './star-rating';

export default function Review({ name, score, text }) {
  return (
    <div className={styles.review}>
      <StarRating score={score} />
      <p className={clsx(styles.text, 'p-medium')}>{text}</p>
      <span className={clsx(styles.name, 'p-medium')}>{name}</span>
    </div>
  );
}
