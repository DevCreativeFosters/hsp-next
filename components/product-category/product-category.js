import Link from 'next/link';

import { getIcon } from '@lib/icons';
import routes from '@lib/routes';

import CategoryCard from '@components/category-card/category-card';
import TitleAndDescription from '@components/title-and-description/title-and-description';

import styles from './product-category.module.scss';

export default function ProductCategory({ category }) {
  const subCategories = category?.children?.nodes || [];
  const ArrowIcon = getIcon('arrow-forward');
  return (
    <div className={styles.productCategory}>
      <TitleAndDescription
        description={category?.description}
        title={category?.name}
      />
      <div
        className={styles.subCategories}
        data-total-tiles={subCategories.length + 1}
        data-total-tiles-mod-2={(subCategories.length + 1) % 2}
        data-total-tiles-mod-3={(subCategories.length + 1) % 3}
        data-total-tiles-mod-4={(subCategories.length + 1) % 4}
      >
        {subCategories.map(subCategory => (
          <CategoryCard category={subCategory} key={subCategory.databaseId} />
        ))}
        <Link className={styles.ctaLink} href={routes.uteBuilder}>
          <span>Build your setup</span>
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}
