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
import { SESSION_STORAGE_USER_DATA } from '@lib/session-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(USER_EXAMPLE);
  const [initialLoad, setInitialLoad] = useState(false);

  const router = useRouter();

  const getUserFromStorage = useCallback(() => {
    const userString = localStorage.getItem(SESSION_STORAGE_USER_DATA);
    if (userString) {
      try {
        const userParsed = JSON.parse(userString);
        setUser(userParsed);
      } catch (err) {
        console.error(err);
      }
    }
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem(SESSION_STORAGE_USER_DATA);
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

  return (
    <UserContext.Provider
      value={{
        getUserById,
        handleLogout,
        handleSave,
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
