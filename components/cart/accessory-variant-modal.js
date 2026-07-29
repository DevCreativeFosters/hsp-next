'use client';

import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';
import { useUserContext } from '@contexts/user';
import { useWishlist } from '@contexts/wishlist';

import Button from '@components/button/button';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import StarRating from '@components/reviews/star-rating';


import styles from './accessory-variant-modal.module.scss';

// Variant-select popup for the "More Accessories to Add" carousel
// on /cart — Figma node 98:2906. Shows the product image, name,
// category, part number, review stars, a variant dropdown, price
// + install cost, In Stock indicator, quantity stepper, and an
// Add to Cart button. Closes on the X in the top-right corner or
// on backdrop click.
export default function AccessoryVariantModal({ onClose, product }) {
  const [mounted, setMounted] = useState(false);
  const { addToCart } = useCart() || {};
  const { user } = useUserContext() || {};
  const { addToWishlist, isInWishlist, removeFromWishlist } =
    useWishlist() || {};
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  // Custom dropdown open state — the native <select> was
  // showing the OS-styled option list which overflowed the
  // modal on the right and highlighted the hovered row blue.
  // A controlled panel keeps the list inside the bordered box
  // and lets us style it dark to match the PDP.
  const [variantOpen, setVariantOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!product) return;
    const variants = product?.productFields?.variants || [];
    setSelectedSlug(variants[0]?.variantSlug || '');
    setQuantity(1);
    setVariantOpen(false);
  }, [product]);

  // Close the custom dropdown on outside click / Escape so it
  // doesn't strand open when the shopper clicks elsewhere in
  // the modal.
  useEffect(() => {
    if (!variantOpen) return;
    const onDocClick = e => {
      if (!e.target.closest?.(`.${styles.variantField}`)) {
        setVariantOpen(false);
      }
    };
    const onKey = e => {
      if (e.key === 'Escape') setVariantOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [variantOpen]);

  if (!mounted || !product) return null;

  const variants = product?.productFields?.variants || [];
  const selectedVariant =
    variants.find(v => v.variantSlug === selectedSlug) || variants[0];
  const basePrice = product?.productFields?.price;
  const baseInstall = product?.productFields?.installationCost;

  const variantPrice = selectedVariant?.variantDetails?.price
    ? selectedVariant.variantDetails.price
    : selectedVariant?.parentInherit
      ? basePrice
      : null;
  const variantInstall = selectedVariant?.variantDetails?.installationCost
    ? selectedVariant.variantDetails.installationCost
    : selectedVariant?.parentInherit
      ? baseInstall
      : null;

  const handleAdd = async () => {
    if (!selectedVariant || adding) return;
    setAdding(true);
    // Resolve the same image the modal displays (variant → product →
    // featured) and thread it into the cart line. WP's addToCart
    // response carries no image for these variant add-ons, so without
    // this the cart rendered a blank thumbnail. Mirrors the fallback
    // chain in galleryImages below, using the raw source fields.
    const productImage =
      selectedVariant?.variantDetails?.images?.nodes?.[0]?.mediaItemUrl ||
      product?.productFields?.images?.nodes?.[0]?.mediaItemUrl ||
      product?.featuredImage?.node?.sourceUrl ||
      null;
    try {
      // Pass price + compareAtPrice through so buildShadowItem
      // has a reliable override — previously we left them off
      // and WP's addToCart response occasionally came back with
      // price:0 (or the wrong variant's price), which showed as
      // $0.00 in the cart summary. Same override pattern PDP's
      // enquiry form uses for tier pricing, minus the tier flag.
      await addToCart?.({
        productId: product.databaseId,
        product_image: productImage,
        quantity,
        variant_name: selectedVariant.variantName,
        variant_sku: selectedVariant.sku,
        variant_slug: selectedVariant.variantSlug,
        ...(variantPrice != null && { price: variantPrice }),
        ...(selectedVariant?.variantDetails?.compareAtPrice != null && {
          compareAtPrice: selectedVariant.variantDetails.compareAtPrice,
        }),
      });
      onClose?.();
    } catch (err) {
      console.error('add to cart from accessory modal failed:', err?.message);
    } finally {
      setAdding(false);
    }
  };

  // Build the gallery image list in the exact shape
  // ProductImageCarousel expects (alt / mainImage / sourceUrl),
  // matching the PDP fallback order — variant images →
  // product-level images → featuredImage.
  const galleryImages = (() => {
    const variantImgs = selectedVariant?.variantDetails?.images?.nodes || [];
    if (variantImgs.length) {
      return variantImgs.map((n, i) => ({
        alt: n?.altText || 'Product variant image',
        mainImage: i === 0,
        sourceUrl: n.mediaItemUrl,
      }));
    }
    const productImgs = product?.productFields?.images?.nodes || [];
    if (productImgs.length) {
      return productImgs.map((n, i) => ({
        alt: n?.altText || 'Main product image',
        mainImage: i === 0,
        sourceUrl: n.mediaItemUrl,
      }));
    }
    const fi = product?.featuredImage?.node;
    return fi
      ? [
          {
            alt: fi.altText || product?.title || 'Product image',
            mainImage: true,
            sourceUrl: fi.sourceUrl,
          },
        ]
      : [];
  })();

  // Wishlist toggle — mirrors the PDP handler exactly. Guests
  // get bounced to /login; signed-in users flip the state and
  // the heart icon swaps filled ↔ outline.
  const inWishlist =
    typeof isInWishlist === 'function'
      ? isInWishlist(product?.databaseId)
      : false;
  const handleWishlistToggle = () => {
    if (!product?.databaseId) return;
    if (!user?.id) {
      router.push('/login');
      return;
    }
    if (inWishlist) {
      removeFromWishlist?.(product.databaseId);
    } else {
      addToWishlist?.(product.databaseId);
    }
  };
  // Real product category (WP taxonomy), not the slug-derived
  // string we were showing before — the fallback rendered
  // "nissan-navara-d27-2026-4" as a category badge because these
  // products have flat slugs without a "/" prefix.
  const category = product?.productCategories?.nodes?.[0]?.name || '';

  // Review count + averageRating for the star row — matches the
  // PDP calculation exactly (comments.nodes reduce → total/count).
  // commentCount from the query is the display number after the
  // stars. Falls back to 0/0 gracefully when a product has no
  // reviews and hides the "(N reviews)" text in that case.
  const reviewNodes = product?.comments?.nodes || [];
  const reviewCount = product?.commentCount ?? reviewNodes.length;
  const averageRating = (() => {
    if (!reviewNodes.length) return 0;
    const total = reviewNodes.reduce((sum, n) => sum + (n?.rating || 0), 0);
    return total / reviewNodes.length;
  })();

  return createPortal(
    <div
      aria-modal="true"
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button
          aria-label="Close"
          className={styles.closeBtn}
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        <div className={styles.body}>
          {/* Image column — reuses the exact ProductImageCarousel
              the PDP renders so the thumbnails, active state,
              nav arrows, and main-image swap all match. Feeding
              it the same shape (alt / mainImage / sourceUrl)
              PDP uses.
              key={selectedSlug} forces a remount when the shopper
              switches variant. Without it the carousel's internal
              selectedImage state stays pinned to the first image
              of the OLD variant (the component only reads
              images[0] on initial useState) even after we hand it
              new images — so the main picture wouldn't update and
              the container would resize as thumbs changed
              underneath. On the PDP this doesn't matter because
              variant switching triggers a full route.push. */}
          <div className={styles.imageCol}>
            <ProductImageCarousel
              images={galleryImages}
              key={selectedSlug}
              showTileCarousel={false}
            />
          </div>
          <div className={styles.info}>
            {category && <div className={styles.category}>{category}</div>}
            <h2 className={styles.title}>{product.title}</h2>
            {selectedVariant?.sku && (
              <p className={styles.partNo}>
                PART NO. <span>{selectedVariant.sku}</span>
              </p>
            )}
            {/* Reviews stars on the left + Wishlist icon on the
                right — real StarRating component and real
                commentCount from the product query so the row
                matches the PDP exactly. Wishlist is visual only
                (this is an upsell modal, not the PDP). */}
            <div className={styles.ratingRow}>
              <div className={styles.rating}>
                <StarRating color="yellow" score={averageRating} />
                <span>
                  ({reviewCount} review{reviewCount === 1 ? '' : 's'})
                </span>
              </div>
            </div>
            {/* Info card — variant / price / stock / qty / CTAs
                all wrapped in one bordered box per PDP. */}
            <div className={styles.infoCard}>
              {variants.length > 1 && (
                <div className={styles.variantField}>
                  <button
                    aria-expanded={variantOpen}
                    aria-haspopup="listbox"
                    className={styles.variantTrigger}
                    onClick={() => setVariantOpen(v => !v)}
                    type="button"
                  >
                    <span className={styles.variantTriggerValue}>
                      {selectedVariant?.variantName || 'Select variant'}
                    </span>
                    <span
                      aria-hidden
                      className={
                        variantOpen
                          ? `${styles.variantTriggerCaret} ${styles.open}`
                          : styles.variantTriggerCaret
                      }
                    />
                  </button>
                  {variantOpen && (
                    <ul className={styles.variantList} role="listbox">
                      {variants.map(v => (
                        <li
                          aria-selected={v.variantSlug === selectedSlug}
                          className={
                            v.variantSlug === selectedSlug
                              ? `${styles.variantOption} ${styles.selected}`
                              : styles.variantOption
                          }
                          key={v.variantSlug}
                          onClick={() => {
                            setSelectedSlug(v.variantSlug);
                            setVariantOpen(false);
                          }}
                          role="option"
                        >
                          {v.variantName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div className={styles.mobInstall}>
                <div className={styles.addRow}>
                  <div className={styles.qtyStepper}>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <div className={styles.qtyArrows}>
                      <button
                        aria-label="Increase"
                        className={styles.qtyUp}
                        onClick={() => setQuantity(q => q + 1)}
                        type="button"
                      />
                      <button
                        aria-label="Decrease"
                        className={styles.qtyDown}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        type="button"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.stock}>● In Stock</div>
              </div>
              <div className={styles.priceRow}>
                {variantPrice != null && (
                  <span className={styles.price}>${variantPrice}</span>
                )}
                {selectedVariant?.variantDetails?.compareAtPrice != null &&
                  selectedVariant.variantDetails.compareAtPrice >
                    variantPrice && (
                    <span className={styles.priceCompare}>
                      ${selectedVariant.variantDetails.compareAtPrice}
                    </span>
                  )}
                {variantInstall > 0 && (
                  <span className={styles.install}>
                    +<span>${variantInstall} for installation</span>
                  </span>
                )}
              </div>
              <div className={clsx(styles.stock, styles.forDesk)}>
                ● In Stock
              </div>
              <div className={clsx(styles.addRow, styles.forDesk)}>
                <div className={styles.qtyStepper}>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <div className={styles.qtyArrows}>
                    <button
                      aria-label="Increase"
                      className={styles.qtyUp}
                      onClick={() => setQuantity(q => q + 1)}
                      type="button"
                    />
                    <button
                      aria-label="Decrease"
                      className={styles.qtyDown}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      type="button"
                    />
                  </div>
                </div>
                <Button
                  className={styles.addBtn}
                  disabled={adding || !selectedVariant}
                  onClick={handleAdd}
                  size="large"
                  variant="primary"
                >
                  {adding ? 'Adding…' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
