'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SESSION_STORAGE_USER_DATA } from '@lib/session-storage';
import { USER_EXAMPLE } from '@mockup/user';

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

  useEffect(handleSave, []); // TODO: replace with actual authentication
  useEffect(getUserFromStorage, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        handleSave,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
