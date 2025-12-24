'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';

import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';

import styles from './cart-sidebar.module.scss';

export default function CartSidebar() {
  const {
    cartItems,
    cartSubTotal,
    closeCart,
    isCartOpen,
    loading,
    removeFromCart,
    updateCart,
  } = useCart();

  const [isCartWrapperVisible, setIsCartWrapperVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsCartWrapperVisible(isCartOpen);
    }, 400);
  }, [isCartOpen]);

  return (
    <div
      className={styles.cartMain}
      style={{
        visibility: isCartOpen ? 'visible' : 'hidden',
      }}
    >
      <div
        className={clsx(styles.cartWrapper, {
          [styles.slideIn]: isCartWrapperVisible,
        })}
        onClick={e => e.stopPropagation()}
      >
        <h2>Shopping Cart:</h2>
        {cartItems.map((item, index) => (
          <div className={styles.cartItem} key={index}>
            <div className={styles.listImg}>
              <img src={item.product_image} />
            </div>

            <div className={styles.itemInfo}>
              <h6>{item.product_name}</h6>
              <div className={styles.itemPrice}>
                {formatPrice(item.price)}{' '}
                {!!item?.compareAtPrice && (
                  <del>{formatPrice(item.compareAtPrice)}</del>
                )}
              </div>
              <div className={styles.itemBottom}>
                <div className={styles.qtyBlock}>
                  <button
                    className={styles.minus}
                    disabled={loading}
                    onClick={() =>
                      updateCart(
                        item.cart_item_key,
                        item.product_id,
                        item.quantity - 1,
                      )
                    }
                  >
                    -
                  </button>
                  <input
                    disabled={true}
                    min="0"
                    onChange={e =>
                      updateCart(
                        item.cart_item_key,
                        item.product_id,
                        e.target.value,
                      )
                    }
                    type="number"
                    value={item.quantity}
                  />
                  <button
                    className={styles.plus}
                    disabled={loading}
                    onClick={() =>
                      updateCart(
                        item.cart_item_key,
                        item.product_id,
                        item.quantity + 1,
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <a
                  className={styles.removeLink}
                  href="#"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  Remove
                </a>
              </div>
            </div>
          </div>
        ))}

        <div className={styles.cartTotal}>Subtotal: ${cartSubTotal}</div>

        <Button
          className={styles.cartSubmitButton}
          onClick={() => {
            closeCart();
            router.push('/checkout');
          }}
          size="large"
        >
          Check Out
          <svg
            fill="none"
            height="34"
            width="34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.031 15.031v3.938H8.656l11.157 11.25L17 33.03.969 17 17 .969l2.813 2.812-11.157 11.25z"
              fill="#fff"
            ></path>
          </svg>
        </Button>
        <Button
          className={styles.dismissButton}
          onClick={() => closeCart()}
          size="large"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
