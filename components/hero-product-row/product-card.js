import Image from 'next/image';
import styles from './product-card.module.scss';
import Link from 'next/link';

export default function ProductCard({product}) {
  const productLink = product.link?.url;
  const productTitle = product.title;
  const productImage = product.productImage?.sourceUrl;

  return (
    <Link href={productLink} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          className={styles.productImage}
          src={productImage}
          alt={productTitle}
          width={168}
          height={120}/>
      </div>
      {productTitle && <p className={styles.productName}>{productTitle}</p>}
    </Link>
  )
}
