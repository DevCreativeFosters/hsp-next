import Image from 'next/image';
import Link from 'next/link';

import Button from '@components/button/button';
import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './product-grid.module.scss';

export default function ProductGrid({
  products,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <Container collapseMargin>
      <div className={styles.container}>
        {title && (
          <DynamicTitle
            className={styles.title}
            titleTag={titleTag}
            titleTagStyle={titleTagStyle}
          >
            {title}
          </DynamicTitle>
        )}
        <div className={styles.grid}>
          {products?.map((product, index) => {
            return (
              <div className={styles.product} key={`${product.title}-${index}`}>
                <div className={styles.buttonContainer}>
                  <Button
                    className={styles.link}
                    href={product.link?.url || '#'}
                    rightIcon="arrow-forward"
                    size="small"
                    variant="tertiary"
                  >
                    {product.title}
                  </Button>
                </div>
                <Link
                  className={styles.imageContainer}
                  href={product.link?.url || '#'}
                  tabIndex="-1"
                >
                  <Image
                    alt={product.title}
                    className={styles.image}
                    fill
                    src={product.productImage?.node?.mediaItemUrl}
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
