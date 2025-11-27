'use client';

import React, { useEffect } from 'react';

import { useUserContext } from '@contexts/user';

import EditIconSvg from '@assets/icons/pencil-icon.svg';

import styles from './user-details.module.scss';

function UserDetails() {
  const { getUserById, setUser, user } = useUserContext();

  //   Fetch user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(Number(user.id));

        setUser(prevUser => ({
          ...prevUser,
          ...userData,
        }));
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={styles.accountDetails}>
      <div className={styles.info}>
        <div className={styles.dRow}>
          <div className={styles.dTitle}>First Name</div>
          <div className={styles.dDesc}>{user?.firstName}</div>
          <div className={styles.dAction}>
            <a href="#">
              <EditIconSvg />
            </a>
          </div>
        </div>
        <div className={styles.dRow}>
          <div className={styles.dTitle}>Last Name</div>
          <div className={styles.dDesc}>{user?.lastName}</div>
          <div className={styles.dAction}>
            <a href="#">
              <EditIconSvg />
            </a>
          </div>
        </div>
        <div className={styles.dRow}>
          <div className={styles.dTitle}>Phone Number</div>
          <div className={styles.dDesc}>{user?.phone}</div>
        </div>
        <div className={styles.dRow}>
          <div className={styles.dTitle}>Email</div>
          <div className={styles.dDesc}>
            <a href={`mailto:${user?.email}`}>{user?.email}</a>
          </div>
        </div>
      </div>

      <div className={styles.currentStatus}>
        <div className={styles.title}>Member Since</div>
        <div className={styles.date}>{user?.member_since}</div>
      </div>
    </div>
  );
}

export default UserDetails;
