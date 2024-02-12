'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SESSION_STORAGE_USER_DATA } from '@lib/session-storage';

const UserContext = createContext();

const USER_DATA_EXAMPLE = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  phone: '070072772',
  streetAddress: 'Sydney Park Road 48',
  streetAddress2: 'Extra street info',
  city: 'Sydney',
  state: 'NSW',
  postalCode: 2055,
  country: 'AU',
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(USER_DATA_EXAMPLE);

  const getUserFromStorage = useCallback(() => {
    const userString = sessionStorage.getItem(SESSION_STORAGE_USER_DATA);
    try {
      const userParsed = JSON.parse(userString);
      setUser(userParsed);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSave = useCallback(() => {
    const userDataString = JSON.stringify(user);
    sessionStorage.setItem(SESSION_STORAGE_USER_DATA, userDataString);
  }, [user]);

  useEffect(handleSave, []);
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
