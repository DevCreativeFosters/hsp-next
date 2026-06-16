// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { fetchAPI } from '@lib/fetch-api';

import { useVehicleContext } from './vehicle';

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';
// import { createContext, useContext, useState } from 'react';
// const CartContext = createContext();
// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// 'use client';

// import { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [cartItems, setCartItems] = useState([]);

//   const openCart = () => setIsCartOpen(true);
//   const closeCart = () => setIsCartOpen(false);
//   const toggleCart = () => setIsCartOpen(!isCartOpen);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         closeCart,
//         isCartOpen,
//         openCart,
//         setCartItems,
//         toggleCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// ---------------------------------------------------------------------------
// localStorage shadow cart.
//
// WP's `getCartItems` resolver reads from `WC()->cart`, which is keyed by the
// WooCommerce session cookie. That cookie is unreliable across the Vercel ↔
// Cloudways origin pair, so for authenticated users the read returns empty
// even when `addToCart` succeeded server-side. To keep the cart usable we
// shadow every mutation into localStorage (per-user key) and treat it as the
// source of truth for authed users. Guests still hit WP (their session
// cookie is same-origin enough to work).
// ---------------------------------------------------------------------------

const LOCAL_CART_KEY_PREFIX = 'hsp_local_cart_';

const readUserIdFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const id = parseInt(localStorage.getItem('userId'), 10);
  return Number.isNaN(id) ? null : id;
};

const localCartKey = userId => {
  const id = userId ?? readUserIdFromStorage();
  return id ? `${LOCAL_CART_KEY_PREFIX}${id}` : null;
};

const readLocalCart = userId => {
  const key = localCartKey(userId);
  if (!key || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.items) ? parsed : null;
  } catch (err) {
    console.error('Local cart read failed:', err);
    return null;
  }
};

const writeLocalCart = (userId, state) => {
  const key = localCartKey(userId);
  if (!key || typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.error('Local cart write failed:', err);
  }
};

const toNum = v => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const computeCartTotals = items => {
  const list = Array.isArray(items) ? items : [];
  return {
    cartCount: list.reduce(
      (acc, it) => acc + (parseInt(it.quantity, 10) || 0),
      0,
    ),
    cartSubTotal: list.reduce((acc, it) => acc + toNum(it.subtotal), 0),
    cartTotal: list.reduce((acc, it) => acc + toNum(it.total), 0),
  };
};

// Map an addToCart-style response (snake_case variant_*) onto the
// getCartItems item shape (camelCase variantName/variantSlug/variantSku) that
// every cart consumer expects. Gift-card metadata is mirrored from the input
// payload because addToCart does not return those fields.
const buildShadowItem = (response, input = {}) => {
  if (!response) return null;
  const quantity = parseInt(response.quantity, 10) || 0;
  // If the caller passed an explicit price (B2B tier pricing from PDP), use
  // it — WP's addToCart resolver returns the public sale price and ignores
  // the dealer's tier, so we have to thread it through ourselves.
  const overridePrice = input.price != null ? toNum(input.price) : null;
  const price = overridePrice != null ? overridePrice : toNum(response.price);
  const install = toNum(response.installation_cost);
  const freight = toNum(response.freight);
  const computedSubtotal = price * quantity;
  const computedTotal = computedSubtotal + install + freight;
  const subtotal =
    overridePrice != null
      ? computedSubtotal
      : toNum(response.subtotal) || computedSubtotal;
  const total =
    overridePrice != null
      ? computedTotal
      : toNum(response.total) || computedTotal;
  return {
    cart_item_key: response.cart_item_key,
    compareAtPrice: input.compareAtPrice ?? response.compareAtPrice ?? null,
    customAmount: input.customAmount ?? null,
    freight,
    installation_cost: install,
    largeItem: response.largeItem ?? input.largeItem ?? false,
    message: response.message ?? input.message ?? null,
    price,
    price_total: computedSubtotal,
    product_id: response.product_id,
    product_image: response.product_image ?? input.product_image ?? null,
    product_name: response.product_name ?? input.product_name ?? '',
    product_slug: response.product_slug ?? null,
    quantity,
    recipientEmail: input.recipientEmail ?? null,
    recipientName: input.recipientName ?? null,
    sendDate: input.sendDate ?? null,
    sendType: input.sendType ?? null,
    senderName: input.senderName ?? null,
    subtotal,
    total,
    variantName: response.variant_name ?? input.variant_name ?? null,
    variantSku: response.variant_sku ?? input.variant_sku ?? null,
    variantSlug: response.variant_slug ?? input.variant_slug ?? null,
    variant_price: toNum(response.variant_price),
  };
};

const upsertLocalCartItem = (userId, item) => {
  if (!item) return null;
  const state = readLocalCart(userId) || { items: [] };
  const idx = state.items.findIndex(
    it => it.cart_item_key === item.cart_item_key,
  );
  if (idx >= 0) {
    state.items[idx] = { ...state.items[idx], ...item };
  } else {
    state.items.push(item);
  }
  writeLocalCart(userId, state);
  return state;
};

const removeLocalCartItem = (userId, cartItemKey) => {
  const state = readLocalCart(userId);
  if (!state) return null;
  state.items = state.items.filter(it => it.cart_item_key !== cartItemKey);
  writeLocalCart(userId, state);
  return state;
};

const patchLocalCartItem = (userId, cartItemKey, patch) => {
  const state = readLocalCart(userId);
  if (!state) return null;
  const idx = state.items.findIndex(it => it.cart_item_key === cartItemKey);
  if (idx < 0) return state;
  const merged = { ...state.items[idx], ...patch };
  const qty = parseInt(merged.quantity, 10) || 0;
  const unitPrice = toNum(merged.price);
  const install = toNum(merged.installation_cost);
  const freight = toNum(merged.freight);
  merged.subtotal = unitPrice * qty;
  merged.total = unitPrice * qty + install + freight;
  merged.price_total = unitPrice * qty;
  state.items[idx] = merged;
  writeLocalCart(userId, state);
  return state;
};

const CartContext = createContext();

export function CartProvider({ children }) {
  const { setPopupOpen } = useVehicleContext();

  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartSubTotal, setCartSubTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // When logged in, cart operations must be tied to the user's persistent
  // cart. Otherwise items are added to the guest session, and the first
  // authenticated request (e.g. wishlist) makes WooCommerce swap in the
  // user's empty cart and wipe the guest cart. Passing the auth token (and
  // userId) keeps add + read on the same user cart. Guests pass nothing.
  const authConfig = () => {
    if (typeof window === 'undefined') return {};
    const authToken = localStorage.getItem('authToken');
    return authToken ? { authToken } : {};
  };
  const currentUserId = () => {
    if (typeof window === 'undefined') return null;
    const id = parseInt(localStorage.getItem('userId'));
    return Number.isNaN(id) ? null : id;
  };

  // 🔹 Fetch Cart
  // Authenticated users → read from the localStorage shadow (WP's
  // session-scoped read is unreliable cross-origin). Guests → read from WP.
  const getCartItems = useCallback(async () => {
    setLoading(true);
    try {
      const userId = currentUserId();

      if (userId) {
        const local = readLocalCart(userId);
        const items = local?.items ?? [];
        const totals = computeCartTotals(items);
        setCartItems(items);
        setCartCount(totals.cartCount);
        setCartSubTotal(totals.cartSubTotal);
        setCartTotal(totals.cartTotal);
        return;
      }

      const query = `
        query GetCartItems {
          getCartItems {
            status
            message
            cartCount
            cartTotal
            cartSubTotal
            items {
              cart_item_key
              product_id
              quantity
              price
              compareAtPrice
              installation_cost
              subtotal
              total
              price_total
              variant_price
              variantName
              variantSlug
              variantSku
              freight
              largeItem
              product_name
              product_slug
              product_image

              customAmount
              recipientName
              senderName
              recipientEmail
              message
              sendType
              sendDate
            }
          }
        }
      `;

      const res = await fetchAPI(query, { ...authConfig() });

      const data = res?.getCartItems;

      if (data) {
        if (data.items >= 0) setIsCartOpen(false);
        setCartItems(data.items || []);
        setCartCount(data.cartCount || 0);
        setCartTotal(data.cartTotal || 0);
        setCartSubTotal(data.cartSubTotal || 0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Add to Cart
  const addToCart = useCallback(
    async (item, compatibleWillBeAdded = false) => {
      const query = `
        mutation AddToCart($input: AddToCartInput!) {
          addToCart(input: $input) {
            cart_item_key
            product_id
            quantity
            price
            compareAtPrice
            subtotal
            total
            product_name
            product_slug
            product_image
            variant_name
            variant_slug
            variant_sku
            variant_price
            freight
            installation_cost
            cartCount
            message
          }
        }
      `;

      const userId = currentUserId();
      // price/compareAtPrice are frontend-only overrides (B2B tier from PDP)
      // — WP's AddToCartInput schema rejects them. Strip before sending,
      // but keep them on `item` so buildShadowItem can still use them.
      const {
        compareAtPrice: _shadowCmp,
        price: _shadowPrice,
        ...wpInput
      } = item;
      const data = await fetchAPI(query, {
        variables: { input: { ...wpInput, ...(userId && { userId }) } },
        ...authConfig(),
      });

      const response = data?.addToCart;

      // Mirror the authoritative WP response into localStorage so the cart
      // survives the unreliable getCartItems read path for authed users.
      if (userId && response?.cart_item_key) {
        const shadow = buildShadowItem(response, item);
        upsertLocalCartItem(userId, shadow);
      }

      if (!compatibleWillBeAdded) {
        await getCartItems();
        openCart();
      }

      return response;
    },
    [getCartItems],
  );

  const addMultipleToCart = useCallback(
    async items => {
      const query = `
        mutation AddMultipleToCart($input: AddMultipleToCartInput!) {
          addMultipleToCart(input: $input) {
            message
            cartCount
            cartTotal
            items {
              cart_item_key
              product_id
              product_name
              product_slug
              product_image
              quantity
              price
              compareAtPrice
              subtotal
              total
              variant_name
              variant_slug
              variant_sku
              variant_price
              freight
              installation_cost
            }
          }
        }
      `;

      const userId = currentUserId();
      const data = await fetchAPI(query, {
        variables: {
          input: {
            items: items,
          },
        },
        ...authConfig(),
      });

      const response = data?.addMultipleToCart;
      if (userId && Array.isArray(response?.items)) {
        response.items.forEach((it, idx) => {
          const inputForItem = items?.[idx] || {};
          const shadow = buildShadowItem(it, inputForItem);
          if (shadow) upsertLocalCartItem(userId, shadow);
        });
      }

      await getCartItems();

      openCart();

      return response;
    },
    [getCartItems],
  );

  const addBundleToCart = useCallback(
    async items => {
      const query = `
        mutation AddBundleToCart($input: AddBundleToCartInput!) {
          addBundleToCart(input: $input) {
            message
            cartCount
            cartTotal
            items {
              cart_item_key
              product_id
              product_name
              product_slug
              product_image
              quantity
              price
              compareAtPrice
              subtotal
              total
              variant_name
              variant_slug
              variant_sku
              variant_price
              freight
              installation_cost
            }
          }
        }
      `;

      const userId = currentUserId();
      const data = await fetchAPI(query, {
        variables: {
          input: {
            items: items,
          },
        },
        ...authConfig(),
      });

      const response = data?.addBundleToCart;
      if (userId && Array.isArray(response?.items)) {
        response.items.forEach((it, idx) => {
          const inputForItem = items?.[idx] || {};
          const shadow = buildShadowItem(it, inputForItem);
          if (shadow) upsertLocalCartItem(userId, shadow);
        });
      }

      await getCartItems();

      openCart();

      return response;
    },
    [getCartItems],
  );

  // 🔹 Update Cart
  const updateCart = useCallback(
    async item => {
      const query = `
        mutation UpdateCart($input: UpdateCartInput!) {
          updateCart(input: $input) {
            status
            message
            product_id
            cartCount
          }
        }
      `;

      const userId = currentUserId();
      // Pass userId so WP scopes the update to the user's persistent cart
      // rather than the unreliable WC session cart.
      await fetchAPI(query, {
        variables: { input: { ...item, ...(userId && { userId }) } },
        ...authConfig(),
      });

      if (userId && item?.cartItemKey != null && item?.quantity != null) {
        patchLocalCartItem(userId, item.cartItemKey, {
          quantity: parseInt(item.quantity, 10) || 0,
        });
      }

      await getCartItems();
    },
    [getCartItems],
  );

  // 🔹 Remove from Cart
  const removeFromCart = useCallback(
    async cartItemKey => {
      const query = `
        mutation RemoveFromCart($input: RemoveFromCartInput!) {
          removeFromCart(input: $input) {
            status
            message
            cartCount
          }
        }
      `;

      const userId = currentUserId();
      // Pass userId so WP scopes the remove to the user's persistent cart.
      // Without it, addToCart writes to user_meta but removeFromCart only
      // touches the session cart, leaving stale qty server-side.
      const variables = {
        input: { cartItemKey, ...(userId && { userId }) },
      };

      await fetchAPI(query, { variables, ...authConfig() });

      if (userId) removeLocalCartItem(userId, cartItemKey);

      await getCartItems();
    },
    [getCartItems],
  );

  const openCart = useCallback(() => {
    setPopupOpen(false);
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // 🔹 Auto-fetch cart on first load + whenever the auth token changes (login
  // in another tab dispatches a storage event; same-tab logins should
  // dispatch a manual `authchange` event so this listener fires too).
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    getCartItems();
    const onAuthChange = () => getCartItems();
    const onStorage = e => {
      if (
        !e.key ||
        e.key === 'authToken' ||
        e.key === 'userId' ||
        e.key.startsWith(LOCAL_CART_KEY_PREFIX)
      ) {
        getCartItems();
      }
    };
    window.addEventListener('authchange', onAuthChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('authchange', onAuthChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [getCartItems]);

  return (
    <CartContext.Provider
      value={{
        addBundleToCart,
        addMultipleToCart,
        addToCart,
        cartCount,
        cartItems,
        cartSubTotal,
        cartTotal,
        closeCart,
        getCartItems,
        isCartOpen,
        loading,
        openCart,
        removeFromCart,
        setIsCartOpen,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook for easy use
export function useCart() {
  return useContext(CartContext);
}
