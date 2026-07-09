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

  // Returns { fromPrice, nowPrice }.
  // - No discount: fromPrice = lowest variant price, nowPrice = null.
  // - Discount:    fromPrice = lowest compareAtPrice of discounted
  //                variants (the "was" price), nowPrice = lowest
  //                current price (the "now" price the card highlights
  //                in red).
  //
  // A variant counts as discounted only when its compareAtPrice is
  // strictly greater than its price — WP sometimes stores 0 or the
  // same value in compareAtPrice for non-discounted rows.
  const getPricing = product => {
    const variants = product?.productFields?.variants || [];
    const rows = variants
      .map(v => ({
        compareAt: Number(v?.variantDetails?.compareAtPrice) || 0,
        price: Number(v?.variantDetails?.price) || 0,
      }))
      .filter(r => r.price > 0);

    if (!rows.length) {
      return {
        fromPrice: Number(product?.productFields?.price) || 0,
        nowPrice: null,
      };
    }

    const discounted = rows.filter(r => r.compareAt > r.price);
    const minPrice = Math.min(...rows.map(r => r.price));

    if (discounted.length) {
      return {
        fromPrice: Math.min(...discounted.map(r => r.compareAt)),
        nowPrice: minPrice,
      };
    }

    return { fromPrice: minPrice, nowPrice: null };
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
            const { fromPrice, nowPrice } = getPricing(product);
            const discounted = nowPrice != null;
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
                      <p
                        className={
                          discounted ? styles.cardPriceWas : styles.cardPrice
                        }
                      >
                        From <strong>${fromPrice}</strong>
                      </p>
                    )}
                    {discounted && (
                      <p className={styles.cardPriceNow}>
                        Now <strong>${nowPrice}</strong>
                      </p>
                    )}
                  </div>
                  <button
                    aria-label={`Add ${product.title}`}
                    className={styles.addBtn}
                    onClick={() => setActiveProduct(product)}
                    type="button"
                  >
                    <span>+</span>
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
