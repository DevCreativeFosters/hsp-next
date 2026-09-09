'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

// Map of productId -> databaseIds listed under its "Also Compatible With"
// (compatibleProduct.selectProduct). Products with no entries map to [].
const fetchCompatibleIdsByProduct = async productIds => {
  const query = `
    query CompatibleProductIds($ids: [ID]) {
      products(first: 100, where: { in: $ids }) {
        nodes {
          databaseId
          compatibleProduct {
            selectProduct {
              product {
                nodes {
                  ... on Product {
                    databaseId
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await fetchAPI(query, { variables: { ids: productIds } });
  const map = {};
  for (const node of data?.products?.nodes || []) {
    map[node.databaseId] = (node.compatibleProduct?.selectProduct || [])
      .map(entry => entry?.product?.nodes?.[0]?.databaseId)
      .filter(Boolean);
  }
  return map;
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

  const cartItemsRef = useRef([]);
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

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

  // 🔹 Fetch Cart — WP is the single source of truth. Authenticated users
  // send the Bearer token so the resolver returns their persistent cart.
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
            largeItem
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
      // price / compareAtPrice / product_image are frontend-only hints that
      // WP's AddToCartInput schema rejects — strip them before sending.
      const {
        compareAtPrice: _compareAtPrice,
        price: _price,
        product_image: _productImage,
        ...wpInput
      } = item;
      // userId scopes the write to the user's persistent cart on WP.
      const inputWithUser = userId != null ? { ...wpInput, userId } : wpInput;
      const data = await fetchAPI(query, {
        variables: { input: inputWithUser },
        ...authConfig(),
      });

      const response = data?.addToCart;

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

      const data = await fetchAPI(query, {
        variables: {
          input: {
            items: items,
          },
        },
        ...authConfig(),
      });

      const response = data?.addMultipleToCart;

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

      const data = await fetchAPI(query, {
        variables: {
          input: {
            items: items,
          },
        },
        ...authConfig(),
      });

      const response = data?.addBundleToCart;

      await getCartItems();

      openCart();

      return response;
    },
    [getCartItems],
  );

  // 🔹 Remove from Cart
  // Removing a line also removes the accessories that were added from its
  // "Also Compatible With" list — unless another line still in the cart
  // lists the same accessory. Cart lines carry no parent link (and guests
  // read straight from WP), so the relationship is resolved from product
  // data at removal time.
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

      const items = cartItemsRef.current;
      const removed = items.find(it => it.cart_item_key === cartItemKey);
      const remaining = items.filter(it => it.cart_item_key !== cartItemKey);

      let orphanKeys = [];
      if (removed && remaining.length) {
        try {
          const productIds = [
            ...new Set(
              [removed, ...remaining].map(it => Number(it.product_id)),
            ),
          ];
          const compat = await fetchCompatibleIdsByProduct(productIds);
          const removedAccessories = new Set(compat[removed.product_id] || []);
          const stillCovered = new Set(
            remaining.flatMap(it => compat[it.product_id] || []),
          );
          orphanKeys = remaining
            .filter(it => {
              const id = Number(it.product_id);
              return removedAccessories.has(id) && !stillCovered.has(id);
            })
            .map(it => it.cart_item_key);
        } catch (err) {
          console.error(
            '[cart] compatible lookup failed, removing parent only:',
            err?.message,
          );
        }
      }

      for (const key of [cartItemKey, ...orphanKeys]) {
        await fetchAPI(query, {
          variables: { input: { cartItemKey: key } },
          ...authConfig(),
        });
      }

      await getCartItems();
    },
    [getCartItems],
  );

  // 🔹 Update Cart
  const updateCart = useCallback(
    async item => {
      if (item?.cartItemKey != null && parseInt(item.quantity, 10) <= 0) {
        return removeFromCart(item.cartItemKey);
      }

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
    [getCartItems, removeFromCart],
  );

  const openCart = useCallback(() => {
    setPopupOpen(false);
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // 🔹 Clear cart — resets in-memory state. Call after a successful order
  // so the customer doesn't accidentally re-order items.
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartCount(0);
    setCartSubTotal(0);
    setCartTotal(0);
  }, []);

  // 🔹 Auto-fetch cart on first load + whenever the auth token changes (login
  // in another tab dispatches a storage event; same-tab logins should
  // dispatch a manual `authchange` event so this listener fires too).
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    getCartItems();

    const onAuthChange = () => {
      getCartItems();
    };
    const onStorage = e => {
      if (!e.key || e.key === 'authToken' || e.key === 'userId') {
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
