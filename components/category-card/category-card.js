import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './category-card.module.scss';

export default function CategoryCard({ category }) {
  const featuredImage = category?.categoryDetails?.featuredImage;

  return (
    <Link href={`/products/${category.slug}`} className={styles.categoryCard}>
      <div className={styles.imageContainer}>
        <Image
          className={styles.categoryImage}
          src={featuredImage.sourceUrl}
          alt={category.name}
          fill
        />
      </div>
      {category.name && (
        <h2 className={styles.categoryName}>{category.name}</h2>
      )}
      <div className={styles.fromPrice}>
        from ${category.categoryDetails.fromPrice}
      </div>
    </Link>
  );
}
