'use client';

import { useState } from 'react';

import { useCart } from '@contexts/cart-context';

import { addComboToCart } from '@lib/api/add-combo-to-cart';

// @hooks/useAddComboToCart.js

export function useAddComboToCart() {
  const [loading, setLoading] = useState(false);
  const { setCartItems } = useCart();

  const addCombo = async args => {
    setLoading(true);
    try {
      const data = await addComboToCart(args);

      if (data.success) {
        // Update cart items in context
        setCartItems(data.cart.contents.nodes);
        return { data, ok: true };
      } else {
        return { error: data.message || 'Failed to add to cart', ok: false };
      }
    } catch (err) {
      return { error: err.message || 'Something went wrong', ok: false };
    } finally {
      setLoading(false);
    }
  };

  return { addCombo, loading };
}
