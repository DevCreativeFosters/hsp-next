'use client';

import { createContext, useContext, useState } from 'react';

import { fetchAPI } from '@lib/fetch-api';

import { useUserContext } from './user';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [orderResponse, setOrderResponse] = useState(null);
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState(0);

  // Get All Applied Coupons
  const getAllAppliedCoupons = async () => {
    setLoading(true);
    try {
      const query = `
        mutation GetAppliedCoupons {
          getAppliedCoupons(input: {}) {
            coupons {
              code
              amount
              discount_type
              expiry_date
            }
          }
        }
      `;

      const data = await fetchAPI(query);
      if (data?.getAppliedCoupons?.coupons?.length > 0) {
        setTotalDiscount(
          data?.getAppliedCoupons?.coupons?.reduce(
            (acc, curr) => acc + curr.amount,
            0,
          ) || 0,
        );
      }
      setAppliedCoupons(data?.getAppliedCoupons?.coupons || []);
    } catch (err) {
      console.error('Error getting applied coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Apply Coupon
  const applyCoupon = async code => {
    setLoading(true);
    setCouponMessage('');
    try {
      const query = `
        mutation ApplyGiftCard($code: String!) {
          applyGiftCard(input: { code: $code }) {
            success
            message
          }
        }
      `;
      const variables = { code };

      const res = await fetchAPI(query, { variables });
      const data = res?.applyGiftCard;

      if (data?.success) {
        setCouponMessage(`✅ ${data.message}`);
      } else {
        setCouponMessage(`❌ ${data?.message || 'Invalid coupon'}`);
      }

      await getAllAppliedCoupons();

      return data?.success || false;
    } catch (err) {
      console.error('Error applying coupon:', err);
      setCouponMessage('⚠️ Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Submit Checkout Order
  const checkoutOrder = async input => {
    setLoading(true);
    try {
      let query = `
        mutation CheckoutOrder($input: CheckoutOrderInput!) {
          checkoutOrder(input: $input) {
            status
            message
            order_id
            order_total
          }
        }
      `;

      if (user.role === 'b2b') {
        query = `
          mutation DealerCheckoutOrder($input: DealerCheckoutOrderInput!) {
            dealerCheckoutOrder(input: $input) {
              status
              message
              order_id
              order_total
            }
          }
        `;
      }

      const variables = { input };

      const res = await fetchAPI(query, { variables });
      const data = res?.checkoutOrder ?? res?.dealerCheckoutOrder;

      setOrderResponse(data);
      return data;
    } catch (err) {
      console.error('Error creating checkout order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 📝 Create a dealer quote (alternative to placing an order)
  const createQuote = async ({ amount, notes = '' }) => {
    setLoading(true);
    try {
      const query = `
        mutation CreateDealerQuote {
          createDealerQuote(input: {
            user_id: ${parseInt(user.id)},
            amount: "${amount}",
            notes: ${JSON.stringify(notes)}
          }) {
            message
            quote {
              id
              quote_number
              amount
              status
            }
          }
        }
      `;

      const res = await fetchAPI(query);
      return res?.createDealerQuote?.quote ?? null;
    } catch (err) {
      console.error('Error creating dealer quote:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        appliedCoupons,
        applyCoupon,
        checkoutOrder,
        couponMessage,
        createQuote,
        loading,
        orderResponse,
        totalDiscount,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
