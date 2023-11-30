import Link from 'next/link';
import Image from 'next/image';
import routes from '@lib/routes';
import styles from './category-card.module.scss';

export default function CategoryCard({ category }) {
  const featuredImage = category?.mainCategoryDetails?.featuredImage;
  const productUrl = routes.product(category.slug);

  return (
    <Link href={productUrl} className={styles.categoryCard}>
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
