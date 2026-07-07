'use client';

import { useEffect, useRef, useState } from 'react';

import { getCartAccessories } from '@lib/api/get-cart-accessories';

import AccessoryVariantModal from './accessory-variant-modal';
import styles from './more-accessories.module.scss';

// "More Accessories to Add:" upsell carousel on /cart — Figma
// node 658:12937. Fetches 4 products on mount, renders them as
// dark cards with an image, name, "From $X" price, and a red +
// button. Clicking + opens the variant-select popup.
export default function MoreAccessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    // Over-fetch (12) then filter to only products that have a
    // featuredImage — otherwise cards render as blank white
    // boxes when a product has no image set in WP. Slice back
    // down to 8 so the carousel scroll still has some length
    // without being unbounded.
    getCartAccessories(12).then(list => {
      if (cancelled) return;
      const withImages = list.filter(p => p?.featuredImage?.node?.sourceUrl);
      setProducts(withImages.slice(0, 8));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollBy = direction => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.querySelector(`.${styles.card}`)?.offsetWidth || 0;
    const gap = 16;
    track.scrollBy({
      behavior: 'smooth',
      left: (cardWidth + gap) * direction,
    });
  };

  if (loading) return null;
  if (!products.length) return null;

  const getFromPrice = product => {
    const variants = product?.productFields?.variants || [];
    const prices = variants
      .map(v => Number(v?.variantDetails?.price))
      .filter(p => Number.isFinite(p) && p > 0);
    if (!prices.length) {
      return Number(product?.productFields?.price) || 0;
    }
    return Math.min(...prices);
  };

  return (
    <section className={styles.moreAccessories}>
      <h2 className={styles.heading}>More Accessories to Add:</h2>
      <div className={styles.carousel}>
        <button
          aria-label="Previous"
          className={styles.navBtn}
          onClick={() => scrollBy(-1)}
          type="button"
        >
          ‹
        </button>
        <div className={styles.track} ref={trackRef}>
          {products.map(product => {
            const image = product?.featuredImage?.node;
            const fromPrice = getFromPrice(product);
            return (
              <div className={styles.card} key={product.databaseId}>
                <div className={styles.cardImage}>
                  {image?.sourceUrl && (
                    <img
                      alt={image.altText || product.title}
                      loading="lazy"
                      src={image.sourceUrl}
                    />
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardMeta}>
                    <h3 className={styles.cardTitle}>{product.title}</h3>
                    {fromPrice > 0 && (
                      <p className={styles.cardPrice}>
                        From <strong>${fromPrice}</strong>
                      </p>
                    )}
                  </div>
                  <button
                    aria-label={`Add ${product.title}`}
                    className={styles.addBtn}
                    onClick={() => setActiveProduct(product)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          aria-label="Next"
          className={styles.navBtn}
          onClick={() => scrollBy(1)}
          type="button"
        >
          ›
        </button>
      </div>
      {activeProduct && (
        <AccessoryVariantModal
          onClose={() => setActiveProduct(null)}
          product={activeProduct}
        />
      )}
    </section>
  );
}
