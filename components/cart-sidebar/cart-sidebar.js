'use client';

import { useEffect } from 'react';

import { useCart } from '@contexts/cart-context';

import styles from './cart-sidebar.module.scss';

export default function CartSidebar() {
  const { cartItems, closeCart, isCartOpen } = useCart();

  // Listen for the openCart event
  useEffect(() => {
    const handleOpenCart = () => {
      // This will be triggered from the ProductComboDeals component
      // You might want to add logic here to fetch the latest cart items
    };

    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  if (!isCartOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <div className={styles.sidebar} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Your Cart</h2>
          <button className={styles.closeButton} onClick={closeCart}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className={styles.cartItems}>
              {cartItems.map(item => (
                <li className={styles.cartItem} key={item.key}>
                  <span>{item.product.node.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>Price: ${item.total}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.checkoutButton}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}
