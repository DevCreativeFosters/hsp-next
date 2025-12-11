'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useWishlist } from '@contexts/wishlist';

import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';

import styles from './wishlist-items.module.scss';

function WishlistItems() {
  const { removeFromWishlist, wishlistItems } = useWishlist();

  return (
    <div className={styles.wishlistBoxes}>
      {wishlistItems.length > 0 ? (
        wishlistItems.map(item => (
          <div className={styles.wishlistBox} key={item.productId}>
            <figure>
              <Image
                alt={item.productName}
                height={100}
                src={item.variantImage}
                width={100}
              />
            </figure>
            <div className={styles.wContent}>
              <h4>{item.productName}</h4>
              <p>
                <strong>Part No.</strong> {item.variantSlug}
              </p>
              <p>
                <strong>Variant:</strong> {item.variantName}
              </p>
              <div className={styles.price}>{formatPrice(item.price)}</div>
            </div>
            <div className={styles.wActions}>
              <Link className={styles.button} href={item.productSlug}>
                View
              </Link>
              <a
                className={styles.link}
                href="#"
                onClick={() => removeFromWishlist(item.productId)}
              >
                Remove
              </a>
            </div>
          </div>
        ))
      ) : (
        <p>No items in wishlist.</p>
      )}

      <div className={styles.moreBtn}>
        <Button href="/products" size="large" variant="secondary">
          Add More Items to Wishlists
        </Button>
      </div>
    </div>
  );
}

export default WishlistItems;
