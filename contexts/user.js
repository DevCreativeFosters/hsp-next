'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { USER_EXAMPLE } from '@mockup/user';

import { SESSION_STORAGE_USER_DATA } from '@lib/session-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(USER_EXAMPLE);
  const getUserFromStorage = useCallback(() => {
    const userString = sessionStorage.getItem(SESSION_STORAGE_USER_DATA);
    if (userString) {
      try {
        const userParsed = JSON.parse(userString);
        setUser(userParsed);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    const userDataString = JSON.stringify(user);
    sessionStorage.setItem(SESSION_STORAGE_USER_DATA, userDataString);
  }, [user]);

  // TODO: replace with actual authentication
  useEffect(handleSave, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(getUserFromStorage, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider
      value={{
        handleSave,
        setUser,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
