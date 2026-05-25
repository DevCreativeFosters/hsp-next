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
  const getCartItems = useCallback(async () => {
    setLoading(true);
    try {
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
            product_name
            product_image
            cartCount
            total
            message
          }
        }
      `;

      const userId = currentUserId();
      const data = await fetchAPI(query, {
        variables: { input: { ...item, ...(userId && { userId }) } },
        ...authConfig(),
      });

      if (!compatibleWillBeAdded) {
        await getCartItems();
        openCart();
      }

      return data?.addToCart;
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
              quantity
              total
              variant_name
              variant_slug
              variant_sku
            }
          }
        }
      `;

      const data = await fetchAPI(query, {
        variables: {
          input: {
            items: items,
          },
        },
        ...authConfig(),
      });

      await getCartItems();

      openCart();

      return data?.addMultipleToCart;
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
              quantity
              total
              variant_name
              variant_slug
              variant_sku
            }
          }
        }
      `;

      const data = await fetchAPI(query, {
        variables: {
          input: {
            items: items,
          },
        },
        ...authConfig(),
      });

      await getCartItems();

      openCart();

      return data?.addBundleToCart;
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

      await fetchAPI(query, { variables: { input: item }, ...authConfig() });

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

      const variables = { input: { cartItemKey } };

      await fetchAPI(query, { variables, ...authConfig() });

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

  // 🔹 Auto-fetch cart on first load
  useEffect(() => {
    (async () => {
      await getCartItems();
    })();
  }, []);

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
