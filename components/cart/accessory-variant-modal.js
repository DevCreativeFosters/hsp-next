'use client';

import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { useCart } from '@contexts/cart-context';

import Button from '@components/button/button';

import HeartIcon from '@assets/icons/heart.svg';

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
  const [selectedSlug, setSelectedSlug] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  // Custom dropdown open state — the native <select> was
  // showing the OS-styled option list which overflowed the
  // modal on the right and highlighted the hovered row blue.
  // A controlled panel keeps the list inside the bordered box
  // and lets us style it dark to match the PDP.
  const [variantOpen, setVariantOpen] = useState(false);
  // Thumbnail carousel — matches the PDP gallery. currentImgIdx
  // tracks which image is shown in the main panel; the thumbs
  // below click through them.
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!product) return;
    const variants = product?.productFields?.variants || [];
    setSelectedSlug(variants[0]?.variantSlug || '');
    setQuantity(1);
    setVariantOpen(false);
    setCurrentImgIdx(0);
  }, [product]);

  // Reset the gallery index whenever the variant changes so we
  // don't try to show, say, the 3rd image of the previous
  // variant that doesn't exist on the new one.
  useEffect(() => {
    setCurrentImgIdx(0);
  }, [selectedSlug]);

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
    try {
      // Pass price + compareAtPrice through so buildShadowItem
      // has a reliable override — previously we left them off
      // and WP's addToCart response occasionally came back with
      // price:0 (or the wrong variant's price), which showed as
      // $0.00 in the cart summary. Same override pattern PDP's
      // enquiry form uses for tier pricing, minus the tier flag.
      await addToCart?.({
        productId: product.databaseId,
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

  // Build the gallery image list, matching the PDP behaviour:
  //   1. selected variant's images (if any)
  //   2. product-level productFields.images (fallback)
  //   3. featuredImage (final fallback so we always have one)
  //
  // Normalised to { sourceUrl, altText } so the JSX doesn't
  // have to branch on which shape the node came from.
  const galleryImages = (() => {
    const variantImgs = selectedVariant?.variantDetails?.images?.nodes || [];
    if (variantImgs.length) {
      return variantImgs.map(n => ({
        altText: n.altText,
        sourceUrl: n.mediaItemUrl,
      }));
    }
    const productImgs = product?.productFields?.images?.nodes || [];
    if (productImgs.length) {
      return productImgs.map(n => ({
        altText: n.altText,
        sourceUrl: n.mediaItemUrl,
      }));
    }
    const fi = product?.featuredImage?.node;
    return fi ? [{ altText: fi.altText, sourceUrl: fi.sourceUrl }] : [];
  })();
  const activeImage = galleryImages[currentImgIdx] || galleryImages[0] || null;
  // Real product category (WP taxonomy), not the slug-derived
  // string we were showing before — the fallback rendered
  // "nissan-navara-d27-2026-4" as a category badge because these
  // products have flat slugs without a "/" prefix.
  const category = product?.productCategories?.nodes?.[0]?.name || '';

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
          {/* Image column — main image on top, thumbnail row
              below matching the PDP gallery. Thumbs click
              through the gallery images. */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              {activeImage?.sourceUrl && (
                <img
                  alt={activeImage.altText || product.title}
                  loading="lazy"
                  src={activeImage.sourceUrl}
                />
              )}
            </div>
            {galleryImages.length > 1 && (
              <ul className={styles.thumbRow}>
                {galleryImages.map((img, i) => (
                  <li
                    className={
                      i === currentImgIdx
                        ? `${styles.thumb} ${styles.thumbActive}`
                        : styles.thumb
                    }
                    key={`${img.sourceUrl}-${i}`}
                    onClick={() => setCurrentImgIdx(i)}
                  >
                    <img
                      alt={img.altText || `${product.title} thumbnail ${i + 1}`}
                      loading="lazy"
                      src={img.sourceUrl}
                    />
                  </li>
                ))}
              </ul>
            )}
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
                right, matching the PDP layout. Purely visual for
                now — no wishlist wiring here since the modal is an
                upsell entry point, not the PDP. */}
            <div className={styles.ratingRow}>
              <div aria-hidden className={styles.rating}>
                ★★★★★ <span>(reviews)</span>
              </div>
              <div aria-hidden className={styles.wishlistBadge}>
                <HeartIcon />
                <span>Wishlist</span>
              </div>
            </div>
            {/* Info card — variant / price / stock / qty / CTAs
                all wrapped in one bordered box per PDP. */}
            <div className={styles.infoCard}>
              {variants.length > 1 && (
                <div className={styles.variantField}>
                  <span className={styles.variantFieldLabel}>Variant</span>
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
                    + ${variantInstall} for installation
                  </span>
                )}
              </div>
              <div className={styles.stock}>● In Stock</div>
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
                <Button
                  className={styles.addBtn}
                  disabled={adding || !selectedVariant}
                  onClick={handleAdd}
                  size="large"
                  variant="primary"
                >
                  {adding ? 'Adding…' : 'Add to Cart'}
                </Button>
                {/* Make Enquiry — matches the PDP secondary CTA.
                    Just closes the modal for now; wire to the
                    real enquiry flow when we bring the form
                    over from the PDP. */}
                <Button
                  className={styles.enquiryBtn}
                  onClick={onClose}
                  size="large"
                  variant="primary"
                >
                  Make Enquiry
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
