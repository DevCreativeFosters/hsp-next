import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';
import routes from '@lib/routes';

import styles from './category-card.module.scss';

export default function CategoryCard({ category }) {
  const productImageUrl =
    category.mainCategoryDetails?.productImage?.node?.mediaItemUrl;
  const productUrl = routes.product(category.slug);

  return (
    <Link className={styles.categoryCard} href={productUrl}>
      {productImageUrl && (
        <div className={styles.imageContainer}>
          <Image
            alt={category.name}
            className={styles.categoryImage}
            fill
            src={productImageUrl}
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
