import Link from 'next/link';
import Image from 'next/image';
import routes from '@lib/routes';
import { formatPrice } from '@lib/helpers';
import styles from './category-card.module.scss';

export default function CategoryCard({ category }) {
  const productImageUrl =
    category.mainCategoryDetails?.productImage?.node?.mediaItemUrl;
  const productUrl = routes.product(category.slug);

  return (
    <Link href={productUrl} className={styles.categoryCard}>
      {productImageUrl && (
        <div className={styles.imageContainer}>
          <Image
            className={styles.categoryImage}
            src={productImageUrl}
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
          from {formatPrice(category.mainCategoryDetails.fromPrice)}
        </div>
      )}
    </Link>
  );
}
