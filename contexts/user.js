'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { USER_EXAMPLE } from '@mockup/user';
import { useRouter } from 'next/navigation';

import { fetchAPI } from '@lib/fetch-api';
import {
  clearCheckoutContactCache,
  prefetchCheckoutContact,
} from '@lib/prefetch-checkout-contact';
import { SESSION_STORAGE_USER_DATA } from '@lib/session-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(USER_EXAMPLE);
  const [initialLoad, setInitialLoad] = useState(false);

  const router = useRouter();

  const getUserFromStorage = useCallback(() => {
    setLoading(true);
    const userString = localStorage.getItem(SESSION_STORAGE_USER_DATA);
    if (userString) {
      try {
        const userParsed = JSON.parse(userString);
        setUser(userParsed);
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
  }, []);

  const getUserById = useCallback(async userId => {
    try {
      const query = `
        query GetVendorProfile($userId: Int) {
          vendorProfile(userId: $userId) {
            id
            username
            email
            firstName
            lastName
            shopName
            shopUrl
            phone
            member_since
            message
          }
        }
      `;

      const variables = { userId };
      const res = await fetchAPI(query, { variables });

      const data = res?.vendorProfile;

      if (data) {
        return data;
      } else {
        return {};
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      return {};
    }
  }, []);

  const updateUserById = useCallback(async (userId, userData) => {
    try {
      const query = `
        mutation UpdateProfile($input: UpdateProfileInput!) {
          updateProfile(input: $input) {
            success
            message
            error
            profileData
          }
        }
      `;

      const variables = { input: { userId, ...userData } };
      const res = await fetchAPI(query, { variables });

      const data = res?.updateProfile;

      if (data?.success) {
        const parsedJSON = JSON.parse(data.profileData);

        setUser(prevUser => ({
          ...prevUser,
          ...parsedJSON,
        }));
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  }, []);

  const handleLogout = useCallback(() => {
    // Read userId BEFORE removing it so we can scrub their shadow cart
    // and any pre-cached /checkout contact-details snapshot.
    const oldUserId = localStorage.getItem('userId');
    if (oldUserId) {
      localStorage.removeItem(`hsp_local_cart_${oldUserId}`);
      clearCheckoutContactCache(oldUserId);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem(SESSION_STORAGE_USER_DATA);
    // Notify same-tab listeners (eg. CartProvider) that auth just changed.
    window.dispatchEvent(new Event('authchange'));
    router.push('/login');
  }, []);

  const handleSave = useCallback(() => {
    if (initialLoad) {
      const userDataString = JSON.stringify(user);
      localStorage.setItem(SESSION_STORAGE_USER_DATA, userDataString);
    } else {
      setInitialLoad(true);
    }
  }, [user]);

  // TODO: replace with actual authentication
  useEffect(handleSave, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(getUserFromStorage, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Prime the /checkout Contact Details cache as soon as we know
  // who the user is. Without this, the FIRST visit to /checkout
  // after login paints with an empty card while the autofill effect
  // round-trips to WP. Running it here (in the global UserProvider
  // that mounts on every route) means by the time the user
  // navigates to /checkout, the snapshot is already in
  // localStorage and the card paints populated on first render.
  // Subsequent visits are also faster because checkout's autofill
  // effect updates the same cache. Best-effort — errors are
  // swallowed inside the helper.
  useEffect(() => {
    if (loading) return;
    if (!user?.id || !user?.role) return;
    prefetchCheckoutContact(user);
  }, [loading, user?.id, user?.role, user?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider
      value={{
        getUserById,
        handleLogout,
        handleSave,
        loading,
        setUser,
        updateUserById,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
