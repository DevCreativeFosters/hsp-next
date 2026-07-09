'use client';

import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { useCart } from '@contexts/cart-context';

import Button from '@components/button/button';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!product) return;
    const variants = product?.productFields?.variants || [];
    setSelectedSlug(variants[0]?.variantSlug || '');
    setQuantity(1);
  }, [product]);

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

  // Prefer the selected variant's first image when it has one —
  // that's how the PDP swaps images when the shopper flips the
  // variant dropdown. Fall back to the parent's featuredImage if
  // the variant has no images attached (some SKUs don't).
  const variantImageNode =
    selectedVariant?.variantDetails?.images?.nodes?.[0] || null;
  const image = variantImageNode
    ? {
        altText: variantImageNode.altText,
        sourceUrl: variantImageNode.mediaItemUrl,
      }
    : product?.featuredImage?.node;
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
          <div className={styles.imageWrap}>
            {image?.sourceUrl && (
              <img
                alt={image.altText || product.title}
                loading="lazy"
                src={image.sourceUrl}
              />
            )}
          </div>
          <div className={styles.info}>
            {category && <div className={styles.category}>{category}</div>}
            <h2 className={styles.title}>{product.title}</h2>
            {selectedVariant?.sku && (
              <p className={styles.partNo}>
                Part No. <span>{selectedVariant.sku}</span>
              </p>
            )}
            <div aria-hidden className={styles.rating}>
              ★★★★★ <span>(reviews)</span>
            </div>
            {variants.length > 1 && (
              <select
                className={styles.variantSelect}
                onChange={e => setSelectedSlug(e.target.value)}
                value={selectedSlug}
              >
                {variants.map(v => (
                  <option key={v.variantSlug} value={v.variantSlug}>
                    {v.variantName}
                  </option>
                ))}
              </select>
            )}
            <div className={styles.priceRow}>
              {variantPrice != null && (
                <span className={styles.price}>${variantPrice}</span>
              )}
              {variantInstall > 0 && (
                <span className={styles.install}>
                  + {variantInstall} Installation
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
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
