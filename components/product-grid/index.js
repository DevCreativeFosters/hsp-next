import Container from '@components/container/container';
import Image from 'next/image';
import Button from '@components/button/button';
import styles from './product-grid.module.scss';
import Link from 'next/link';

export default function ProductGrid({ title, products }) {
  return (
    <Container collapseMargin>
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.grid}>
          {products?.map((product, index) => {
            return (
              <div key={`${product.title}-${index}`} className={styles.product}>
                <div className={styles.buttonContainer}>
                  <Button
                    href={product.link?.url || '#'}
                    rightIcon="arrow-forward"
                    size="small"
                    variant="tertiary"
                    className={styles.link}
                  >
                    {product.title}
                  </Button>
                </div>
                <Link
                  href={product.link?.url || '#'}
                  tabIndex="-1"
                  className={styles.imageContainer}
                >
                  <Image
                    src={product.productImage.mediaItemUrl}
                    fill
                    alt={product.title}
                    className={styles.image}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
