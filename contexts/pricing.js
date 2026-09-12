'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { fetchAPI } from '@lib/fetch-api';

// Per-user tier pricing, resolved once per product and shared by every
// component that shows a price. WP computes the tier from the Bearer
// token; guests never trigger a lookup and always see the public price.
// Goes away once WP returns the tier price inside product data itself.

const PricingContext = createContext(null);

const TIER_PRICING_QUERY = `
  query TierPricing($ids: [ID]) {
    products(first: 100, where: { in: $ids }) {
      nodes {
        databaseId
        currentTier
        discountPercent
        pricingBadge
        variantPricing {
          sku
          price
          tierPrice
        }
      }
    }
  }
`;

const readToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

export function PricingProvider({ children }) {
  const [pricing, setPricing] = useState({});
  const requested = useRef(new Set());

  // A different user means different tiers — start over on login/logout.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const reset = () => {
      requested.current = new Set();
      setPricing({});
    };
    window.addEventListener('authchange', reset);
    return () => window.removeEventListener('authchange', reset);
  }, []);

  const ensurePricing = useCallback(async productIds => {
    const token = readToken();
    if (!token) return;
    const ids = [
      ...new Set((productIds ?? []).map(Number).filter(Boolean)),
    ].filter(id => !requested.current.has(id));
    if (!ids.length) return;
    ids.forEach(id => requested.current.add(id));

    for (let i = 0; i < ids.length; i += 100) {
      const chunk = ids.slice(i, i + 100);
      try {
        const data = await fetchAPI(TIER_PRICING_QUERY, {
          authToken: token,
          variables: { ids: chunk },
        });
        const next = {};
        for (const node of data?.products?.nodes ?? []) {
          next[node.databaseId] = {
            bySku: Object.fromEntries(
              (node.variantPricing ?? []).map(v => [
                v.sku,
                { price: v.price, tierPrice: v.tierPrice },
              ]),
            ),
            currentTier: node.currentTier,
            discountPercent: node.discountPercent,
            pricingBadge: node.pricingBadge,
          };
        }
        setPricing(prev => ({ ...prev, ...next }));
      } catch (err) {
        chunk.forEach(id => requested.current.delete(id));
        console.error('[pricing] tier lookup failed:', err?.message);
      }
    }
  }, []);

  // Tier price for a variant, or null when the user has none for it.
  const getTierPrice = useCallback(
    (productId, sku) => {
      const entry = pricing[Number(productId)]?.bySku?.[sku];
      if (!entry || entry.tierPrice == null) return null;
      if (entry.price != null && entry.tierPrice >= entry.price) return null;
      return entry.tierPrice;
    },
    [pricing],
  );

  // The user's tier discount for a product as a percentage, or null. Used
  // where WP applies the tier to a price that isn't the variant's own —
  // e.g. a compatible-product special price.
  const getDiscountPercent = useCallback(
    productId => {
      const pct = pricing[Number(productId)]?.discountPercent;
      return pct != null && pct > 0 ? Number(pct) : null;
    },
    [pricing],
  );

  const value = useMemo(
    () => ({ ensurePricing, getDiscountPercent, getTierPrice, pricing }),
    [ensurePricing, getDiscountPercent, getTierPrice, pricing],
  );

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  );
}

const NO_PRICING = {
  ensurePricing: async () => {},
  getDiscountPercent: () => null,
  getTierPrice: () => null,
  pricing: {},
};

export const usePricing = () => useContext(PricingContext) ?? NO_PRICING;
