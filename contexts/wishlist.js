'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { fetchAPI } from '@lib/fetch-api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // TODO: Move to UserContext or AuthContext
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      setAuthToken(token);

      const userId = Number(localStorage.getItem('userId'));
      setUserId(userId);
    }
  }, []);

  const isInWishlist = useCallback(
    (productId, variantIdentifier) => {
      if (productId && variantIdentifier)
        return wishlistItems.some(
          item =>
            item.productId === productId &&
            item.variantIdentifier === variantIdentifier,
        );
      else return wishlistItems.some(item => item.productId === productId);
    },
    [wishlistItems],
  );

  // ✅ Fetch wishlist
  const getWishlistItems = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const query = `
        query WishlistItems($userId: Int!) {
          getWishlistItems(id: $userId) {
            id
            productId
            productName
            productSlug
            variantName
            variantSlug
            variantImage
            dateAdded
            productUrl
            variantNumber
            price
            installation_cost
            productUrl
            removeItemUrl
          }
        }
      `;

      const variables = { userId };
      const res = await fetchAPI(query, { authToken, variables });
      const data = res?.getWishlistItems || [];

      setWishlistItems(data);
      setWishlistCount(data.length);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // ✅ Add to wishlist
  const addToWishlist = useCallback(
    async (productId, variantIdentifier = null) => {
      const query = `
        mutation AddToWishlist($input: AddToWishlistInput!) {
          addToWishlist(input: $input) {
            success
            message
            error
            wishlistItems {
              id
              productId
              variantIdentifier
              dateAdded
            }
          }
        }
      `;

      const variables = { input: { productId, variantIdentifier } };

      const res = await fetchAPI(query, { authToken, variables });
      const data = res?.addToWishlist;

      if (data?.success) {
        setWishlistItems(data.wishlistItems || []);
        setWishlistCount(data.wishlistItems?.length || 0);
      } else {
        console.error('Add to wishlist failed:', data?.message || data?.error);
      }

      return data;
    },
    [authToken],
  );

  // ✅ Remove from wishlist
  const removeFromWishlist = useCallback(
    async (productId, variantIdentifier = null) => {
      const query = `
        mutation RemoveFromWishlist($input: RemoveFromWishlistInput!) {
          removeFromWishlist(input: $input) {
              success
              message
              error
              wishlistItems {
                id
                productId
                variantIdentifier
                dateAdded
                productUrl
                variantNumber
                price
                productUrl
                removeItemUrl
              }
          }
        }
      `;

      const variables = {
        input: { productId, ...(variantIdentifier && { variantIdentifier }) },
      };

      const res = await fetchAPI(query, { authToken, variables });
      const data = res?.removeFromWishlist;

      if (data?.success) {
        setWishlistItems(data.wishlistItems || []);
        setWishlistCount(data.wishlistItems?.length || 0);
      } else {
        console.error(
          'Remove from wishlist failed:',
          data?.message || data?.error,
        );
      }

      return data;
    },
    [authToken],
  );

  // 🔹 Auto-fetch cart on first load
  useEffect(() => {
    getWishlistItems();
  }, [authToken]);

  return (
    <WishlistContext.Provider
      value={{
        addToWishlist,
        getWishlistItems,
        isInWishlist,
        loading,
        removeFromWishlist,
        wishlistCount,
        wishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
