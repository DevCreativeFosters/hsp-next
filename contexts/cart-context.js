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

import { getProductPricing } from '@lib/api/get-product-pricing';
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
// Guests don't have a user id, but their shadow cart still needs a stable
// localStorage key so it can be migrated into the dealer's user_meta cart
// after login. Without this, items added as a guest are only visible to
// WP's anonymous WC()->cart session and become unreachable as soon as the
// authenticated dealer's getCartItems returns its empty user_meta cart.
const GUEST_CART_KEY = `${LOCAL_CART_KEY_PREFIX}guest`;

const readUserIdFromStorage = () => {
  if (typeof window === 'undefined') return null;
  const id = parseInt(localStorage.getItem('userId'), 10);
  return Number.isNaN(id) ? null : id;
};

const localCartKey = userId => {
  const id = userId ?? readUserIdFromStorage();
  return id ? `${LOCAL_CART_KEY_PREFIX}${id}` : GUEST_CART_KEY;
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
  // install + freight are per-item values (a $450 install per unit,
  // a $20 freight per unit) — multiply by qty for the line total,
  // same convention the checkout Summary uses when it reduces
  // cartItems into installSum / freightSum. Prior to this the
  // add-side used the raw per-item values and the subtract-side
  // multiplied by qty, so a qty:2 line "lost" the extra install +
  // freight portion in the AUD total (subtotal 6300 → total 5830
  // instead of 6300 when both are hidden).
  const computedTotal =
    computedSubtotal + install * quantity + freight * quantity;
  // Always use the computed values — WP's response.subtotal /
  // response.total for addToCart line items have been observed
  // to be wrong for retail (returning `price + installation_cost`
  // for a single item regardless of quantity — e.g. price=3150,
  // qty=2, install=450 → response.subtotal=3600 instead of 6300).
  // B2B / dealer already skipped trusting WP because their
  // tier-price override forced computedSubtotal — extending that
  // to all roles keeps the shadow's subtotal / total math
  // internally consistent (price × qty, plus install + freight
  // for total). Line subtotals should always be price × qty
  // regardless — no discount / promotion logic on our side needs
  // WP's aggregate.
  const subtotal = computedSubtotal;
  const total = computedTotal;
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
        if (Array.isArray(data.items) && data.items.length === 0) {
          setIsCartOpen(false);
        }
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
      // Include userId in the WP input for authenticated users. An earlier
      // version of this code stripped userId to dodge a resolver branch that
      // wrote items to _woocommerce_persistent_cart_<userId> user_meta
      // (which getCartItems / checkoutOrder couldn't read back). That bug
      // has since been fixed on the WP side — confirmed by Postman: logging
      // in as a dealer, calling addToCart with `{userId: 82, ...}`, then
      // calling getCartItems with the same auth token returns the items.
      // With userId stripped, addToCart was writing to the anonymous WC()
      // ->cart session (visible only to unauthenticated requests) and the
      // authenticated dealer's getCartItems / checkoutOrder calls saw an
      // empty cart — Place Order then threw "Your cart is empty" for every
      // dealer. Sending userId fixes both reads and writes to hit the same
      // user_meta cart.
      const inputWithUser = userId != null ? { ...wpInput, userId } : wpInput;
      const data = await fetchAPI(query, {
        variables: { input: inputWithUser },
        ...authConfig(),
      });

      const response = data?.addToCart;

      // Mirror into localStorage but DO NOT trust WP's response.quantity:
      // WP's persistent cart may carry stale state we can't clear from the
      // frontend (RemoveFromCart and UpdateCart don't accept userId yet, so
      // they only touch the WC session cart). Compute the shadow quantity
      // locally instead — existing local qty + this click's delta.
      //
      // Writes happen for GUESTS too — readLocalCart/writeLocalCart route to
      // the `hsp_local_cart_guest` key when userId is null (see
      // localCartKey). This is what lets the cart-context authchange
      // listener migrate the guest's items into the dealer's user_meta
      // cart after login. Previously this branch was gated on
      // `userId && ...` so guest carts were never persisted — every
      // page reload or login attempt wiped them.
      if (response?.cart_item_key) {
        const delta = parseInt(item.quantity, 10) || 1;
        const existingItems = readLocalCart(userId)?.items || [];
        const existing = existingItems.find(
          it => it.cart_item_key === response.cart_item_key,
        );
        const localQty = (parseInt(existing?.quantity, 10) || 0) + delta;
        const shadow = buildShadowItem(
          { ...response, quantity: localQty },
          item,
        );
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
      // NOTE: UpdateCartInput on WP does not yet accept `userId`. The
      // resolver therefore scopes to the (unreliable) WC session cart, so
      // quantity changes don't persist for authed dealers server-side until
      // Lokesh updates the resolver to hydrate from
      // _woocommerce_persistent_cart_<userId> via the Bearer token.
      await fetchAPI(query, { variables: { input: item }, ...authConfig() });

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

      // NOTE: RemoveFromCartInput on WP does not yet accept `userId`. The
      // resolver therefore scopes to the WC session cart, so removing only
      // clears the local shadow — the dealer's persistent cart on WP still
      // holds the stale quantity. Lokesh needs to update the resolver to
      // hydrate from _woocommerce_persistent_cart_<userId> via the Bearer
      // token, same pattern as addToCart.
      const variables = { input: { cartItemKey } };

      const userId = currentUserId();
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

  // 🔹 Clear cart — wipes the shadow + in-memory state. Call after a
  // successful order so the dealer doesn't accidentally re-order items.
  const clearCart = useCallback(() => {
    const userId = currentUserId();
    if (userId && typeof window !== 'undefined') {
      const key = localCartKey(userId);
      if (key) localStorage.removeItem(key);
    }
    setCartItems([]);
    setCartCount(0);
    setCartSubTotal(0);
    setCartTotal(0);
  }, []);

  // 🔹 Auto-fetch cart on first load + whenever the auth token changes (login
  // in another tab dispatches a storage event; same-tab logins should
  // dispatch a manual `authchange` event so this listener fires too).
  //
  // Auth-change also triggers a guest→dealer cart MIGRATION. When a guest
  // adds items, their shadow cart lives at `hsp_local_cart_guest` and the
  // WP write goes into the anonymous WC()->cart session. After login, the
  // dealer's authenticated getCartItems reads from their (empty)
  // user_meta cart — so the guest items vanish from the UI even though
  // the dealer just intended to buy those exact products. To recover
  // them we replay each guest item through addToCart (which now sends
  // userId and writes to user_meta), then clear the guest shadow.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const migrateGuestCart = async () => {
      const userId = readUserIdFromStorage();
      if (!userId) return; // still a guest, nothing to migrate
      let guestRaw;
      try {
        guestRaw = localStorage.getItem(GUEST_CART_KEY);
      } catch (_err) {
        return;
      }
      if (!guestRaw) return;
      let guestParsed;
      try {
        guestParsed = JSON.parse(guestRaw);
      } catch (_err) {
        localStorage.removeItem(GUEST_CART_KEY);
        return;
      }
      const guestItems = guestParsed?.items || [];
      if (guestItems.length === 0) {
        localStorage.removeItem(GUEST_CART_KEY);
        return;
      }
      console.log(
        '[Cart] migrating',
        guestItems.length,
        'guest item(s) into dealer cart',
      );
      // Sequential — WP's addToCart returns a cumulative quantity per
      // product, so racing breaks totals.
      //
      // For each guest item: query the now-authenticated dealer's
      // tier pricing for that productId, find the variant by SKU,
      // and pass tierPrice / variantPrice on the addToCart input.
      // addToCart strips them before sending to WP (the schema only
      // accepts productId / quantity / variant_* / userId), then
      // buildShadowItem reads them as the dealer-tier override on
      // the shadow cart entry. Without this lookup the dealer sees
      // WP's public sale price for items they added as a guest.
      for (const item of guestItems) {
        try {
          let tierPrice;
          let tierCompareAt;
          try {
            const pricing = await getProductPricing(item.product_id);
            const variant = pricing?.variantPricing?.find(
              v => v.sku === item.variantSku,
            );
            if (
              variant &&
              variant.tierPrice != null &&
              variant.tierPrice < variant.price
            ) {
              tierPrice = variant.tierPrice;
              tierCompareAt = variant.price;
            }
          } catch (priceErr) {
            console.warn(
              '[Cart] tier price lookup failed for',
              item.product_name,
              priceErr?.message,
            );
          }
          await addToCart({
            // Tier override — stripped before WP, used by
            // buildShadowItem to set the shadow's price/compareAt.
            // Falls back to the guest's price/compareAt if the dealer
            // doesn't have a tier on this variant (e.g. retail-only
            // SKU) so we at least preserve what the guest paid.
            ...(tierPrice != null
              ? { compareAtPrice: tierCompareAt, price: tierPrice }
              : {
                  ...(item.price != null && { price: item.price }),
                  ...(item.compareAtPrice != null && {
                    compareAtPrice: item.compareAtPrice,
                  }),
                }),
            productId: item.product_id,
            quantity: item.quantity,
            variant_name: item.variantName,
            variant_sku: item.variantSku,
            variant_slug: item.variantSlug,
          });
        } catch (err) {
          console.error(
            '[Cart] guest item migration failed for',
            item.product_name,
            err?.message,
          );
        }
      }
      // Successfully replayed — wipe the guest shadow so we don't
      // double-migrate on a later auth event.
      localStorage.removeItem(GUEST_CART_KEY);
    };

    // First run: migrate any leftover guest items (covers users who land
    // on a logged-in page directly without ever firing authchange in
    // this tab — e.g. cookie-session restore on a fresh page load) and
    // then fetch the cart. migrate calls addToCart internally; after it
    // resolves cart state is already up to date, so getCartItems is
    // mostly a sanity refresh.
    (async () => {
      await migrateGuestCart();
      getCartItems();
    })();

    const onAuthChange = async () => {
      await migrateGuestCart();
      getCartItems();
    };
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
  }, [addToCart, getCartItems]);

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
        clearCart,
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
