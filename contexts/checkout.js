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

  // Deliberately NOT threading the auth token through applyGiftCard /
  // getAppliedCoupons — same trick cart-context's addToCart uses for
  // the same underlying WP bug. When the Bearer token is present,
  // Lokesh's resolvers take a B2B code path that reads from the
  // \_woocommerce\_persistent\_cart\_<userId> user_meta store, while
  // addToCart deliberately writes to the WC()->cart session store (it
  // also strips userId to dodge the same branch). Threading the
  // token here makes the coupon resolver look in the wrong store and
  // throw "Your cart is empty" even when the cart panel is full.
  // Same-origin proxy passes the session cookie so logged-in retail
  // and the dealer's WC session still get associated correctly.

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
  //
  // Schema introspection on the staging WP install (Jun 2026) confirmed:
  //   - applyGiftCard       → for GIFT CARDS only ("test" returns
  //                           "Invalid gift card code.")
  //   - handleCoupon        → for WC COUPONS, returns rich payload
  //                           {success, message, code, amount,
  //                            discount_type, already_applied,
  //                            already_used, usage_count, usage_limit,
  //                            expiry_date}
  //   - applyCouponToCart   → also exists (standard WPGraphQL for
  //                           WooCommerce), returns
  //                           {result: CouponOperationResponse}
  //
  // The "Coupon Code" input is wired to coupons, not gift cards, so
  // the primary mutation must be handleCoupon. applyGiftCard stays
  // as a fallback so legacy gift-card codes still work in the same
  // field.
  const applyCoupon = async code => {
    setLoading(true);
    setCouponMessage('');

    // Helper: run a mutation, return its payload, never throw.
    // No authToken — same anonymous-session workaround as
    // cart-context's addToCart, otherwise WP resolvers switch into a
    // B2B branch that reads from a different cart store.
    const runMutation = async (mutationName, queryStr) => {
      try {
        const res = await fetchAPI(queryStr, { variables: { code } });
        return res?.[mutationName] || null;
      } catch (err) {
        console.error(`[Checkout] ${mutationName} threw:`, err?.message);
        return null;
      }
    };

    try {
      // 1. Try handleCoupon (Lokesh's custom coupon resolver, rich
      //    payload). If the code is a valid coupon this succeeds.
      const couponRes = await runMutation(
        'handleCoupon',
        `mutation HandleCoupon($code: String!) {
          handleCoupon(input: { code: $code }) {
            success
            message
            code
            amount
            discount_type
            already_applied
          }
        }`,
      );
      if (couponRes?.success) {
        const msg = couponRes.message?.trim();
        // Build a useful confirmation. Prefer WP's message; else
        // synthesise one from amount + discount_type.
        let label = msg || `Coupon "${couponRes.code || code}" applied`;
        if (!msg && couponRes.amount && couponRes.discount_type) {
          const v =
            couponRes.discount_type === 'percent'
              ? `${couponRes.amount}%`
              : `$${couponRes.amount}`;
          label = `Coupon "${couponRes.code || code}" applied (${v} off)`;
        }
        setCouponMessage(`✅ ${label}`);
        await getAllAppliedCoupons();
        return true;
      }
      if (couponRes?.already_applied) {
        setCouponMessage(`ℹ️ Coupon "${code}" is already applied`);
        return false;
      }

      // 2. Fall back to applyGiftCard for legacy gift-card codes.
      const giftRes = await runMutation(
        'applyGiftCard',
        `mutation ApplyGiftCard($code: String!) {
          applyGiftCard(input: { code: $code }) {
            success
            message
          }
        }`,
      );
      if (giftRes?.success) {
        const giftMsg = giftRes.message?.trim();
        setCouponMessage(`✅ ${giftMsg || 'Gift card applied'}`);
        await getAllAppliedCoupons();
        return true;
      }

      // Neither resolver accepted the code. Surface whichever WP
      // error is more informative — handleCoupon's message ("Coupon
      // does not exist") tells the user more than the gift-card
      // fallback's "Invalid gift card code." which is technically
      // accurate but misleading because the input is a Coupon Code
      // field.
      const couponMsg = couponRes?.message?.trim();
      const giftMsg = giftRes?.message?.trim();
      const display =
        couponMsg && !/gift card/i.test(couponMsg)
          ? couponMsg
          : giftMsg && !/gift card/i.test(giftMsg)
            ? giftMsg
            : 'Invalid or expired coupon code';
      console.log('[Checkout] applyCoupon failed:', { couponRes, giftRes });
      setCouponMessage(`❌ ${display}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Submit Checkout Order
  //
  // Retail + dealer orders go via `checkoutOrder`. (The old custom
  // `dealerCheckoutOrder` resolver was abandoned — it threw "Your cart
  // is empty" because it read from a different WC cart store than
  // `addToCart` writes to; `CheckoutOrderInput` accepts the dealer
  // fields anyway.) B2B now uses the newer `b2bCheckoutOrder` resolver
  // — same payload shape, identified by the Bearer token exactly like
  // the legacy mutation.
  const checkoutOrder = async input => {
    setLoading(true);
    try {
      // B2B now goes through the dedicated b2bCheckoutOrder resolver.
      // Its B2bCheckoutOrderInput is CheckoutOrderInput minus
      // credit_limit / payment_term_id (confirmed via introspection),
      // and our handleSubmit payload sends neither, so the same
      // payload shape coerces cleanly into both. Retail + dealer stay
      // on the legacy checkoutOrder — dealer needs fields the b2b
      // input dropped, and retail has no reason to move.
      // Role from context, with the same localStorage fallback the
      // token uses below (context can lag on a hard refresh).
      const role =
        user?.role ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('userRole')
          : null);

      let query = `
        mutation CheckoutOrder($input: CheckoutOrderInput!) {
          checkoutOrder(input: $input) {
            status
            message
            order_id
            order_total
            payment_term_name
          }
        }`;

      if (role === 'b2b') {
        query = `
          mutation B2bCheckoutOrder($input: B2bCheckoutOrderInput!) {
            b2bCheckoutOrder(input: $input) {
              status
              message
              order_id
              order_total
              payment_term_name
            }
          }`;
      }

      if (role === 'dealer') {
        query = `
          mutation dealerCheckoutOrder($input: DealerCheckoutOrderInput!) {
            dealerCheckoutOrder(input: $input) {
              status
              message
              order_id
              order_total 
            }
          }`;
      }

      const variables = { input };

      // Thread the auth token. Without it WP resolves checkoutOrder
      // against an anonymous WC()->cart (empty for authenticated
      // dealers whose addToCart writes went to user_meta) and throws
      // "Your cart is empty" — even when getCartItems with the same
      // token returns the populated cart, because checkoutOrder
      // doesn't accept a `userId` field in its input
      // (CheckoutOrderInput schema rejected the attempt with
      // `Field "userId" is not defined by type "CheckoutOrderInput"`).
      // The Bearer header is the only way to tell the resolver which
      // dealer's cart to read.
      const authToken =
        user?.token ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('authToken')
          : null);
      const res = await fetchAPI(query, {
        variables,
        ...(authToken && { authToken }),
      });
      const data =
        res?.checkoutOrder || res?.b2bCheckoutOrder || res?.dealerCheckoutOrder;

      setOrderResponse(data);
      return data;
    } catch (err) {
      console.error('Error creating checkout order:', err);
      // Surface the error in a shape handleSubmit can show. Without this
      // the form alerts "Order failed" and the dealer has no clue why —
      // the actual reason (e.g. "Field X not defined by type Y") gets
      // swallowed in the console.
      const message = err?.message?.includes('API returned errors')
        ? err.message
            .replace(/^.*API returned errors:\s*/, '')
            .replace(/\s*\(query:.*$/, '')
        : err?.message || 'Order failed';
      return { message, order_id: null };
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
            user_id: ${parseInt(user?.id ?? '0', 10)},
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

      // createDealerQuote identifies the dealer from the auth token, so it
      // must be sent (otherwise the backend returns "Only dealers can create
      // quotes"). Fall back to localStorage if the context token is missing.
      const authToken =
        user?.token ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('authToken')
          : null);

      const res = await fetchAPI(query, { authToken });
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
