import Link from 'next/link';
import CategoryCard from '@components/category-card/category-card';
import TitleAndDescription from '@components/title-and-description/title-and-description';
import styles from './product-category.module.scss';
import { getIcon } from '@lib/icons';

export default function ProductCategory({ category }) {
  const subCategories = category?.children?.nodes || [];
  const ArrowIcon = getIcon('arrow-forward');

  return (
    <div className={styles.productCategory}>
      <TitleAndDescription
        title={category?.name}
        description={category?.description}
      />
      <div className={styles.subCategories}>
        {subCategories.map(subCategory => (
          <CategoryCard key={subCategory.databaseId} category={subCategory} />
        ))}
        <Link href="#" className={styles.ctaLink}>
          <span>Build Your Setup</span>
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}
