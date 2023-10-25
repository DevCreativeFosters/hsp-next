import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './category-card.module.scss';

export default function CategoryCard({ category }) {
  const featuredImage = category?.mainCategoryDetails?.featuredImage;

  return (
    <Link href={`/products/${category.slug}`} className={styles.categoryCard}>
      {featuredImage?.mediaItemUrl && (
        <div className={styles.imageContainer}>
          <Image
            className={styles.categoryImage}
            src={featuredImage?.mediaItemUrl}
            alt={category.name}
            fill
          />
        </div>
      )}
      {category.name && (
        <h2 className={styles.categoryName}>{category.name}</h2>
      )}
      {category.mainCategoryDetails.fromPrice && (
        <div className={styles.fromPrice}>
          from ${category.mainCategoryDetails.fromPrice}
        </div>
      )}
    </Link>
  );
}
