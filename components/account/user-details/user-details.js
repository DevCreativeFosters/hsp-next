'use client';

import React, { useEffect, useState } from 'react';

import { useUserContext } from '@contexts/user';

import EditIconSvg from '@assets/icons/pencil-icon.svg';
import SaveIconSvg from '@assets/icons/save.svg';

import styles from './user-details.module.scss';

function UserDetails() {
  const { getUserById, setUser, user } = useUserContext();
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(Number(user.id));
        setUser(prevUser => ({ ...prevUser, ...userData }));
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleEdit = (field, currentVal) => {
    setEditingField(field);
    setTempValue(currentVal || '');
  };

  const handleSave = async field => {
    try {
      setUser(prev => ({
        ...prev,
        [field]: tempValue,
      }));
      setEditingField(null);
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  return (
    <div className={styles.accountDetails}>
      <div className={styles.info}>
        {/* First Name Row */}
        <div className={styles.dRow}>
          <div className={styles.dTitle}>First Name</div>
          <div className={styles.dDesc}>
            {editingField === 'firstName' ? (
              <input
                autoFocus
                onChange={e => setTempValue(e.target.value)}
                type="text"
                value={tempValue}
              />
            ) : (
              user?.firstName
            )}
          </div>
          <div className={styles.dAction}>
            {editingField === 'firstName' ? (
              <button
                className={styles.saveBtn}
                onClick={() => handleSave('firstName')}
              >
                <SaveIconSvg /> Save
              </button>
            ) : (
              <button onClick={() => handleEdit('firstName', user?.firstName)}>
                <EditIconSvg />
              </button>
            )}
          </div>
        </div>

        {/* Last Name Row */}
        <div className={styles.dRow}>
          <div className={styles.dTitle}>Last Name</div>
          <div className={styles.dDesc}>
            {editingField === 'lastName' ? (
              <input
                autoFocus
                onChange={e => setTempValue(e.target.value)}
                type="text"
                value={tempValue}
              />
            ) : (
              user?.lastName
            )}
          </div>
          <div className={styles.dAction}>
            {editingField === 'lastName' ? (
              <button
                className={styles.saveBtn}
                onClick={() => handleSave('lastName')}
              >
                <SaveIconSvg /> Save
              </button>
            ) : (
              <button onClick={() => handleEdit('lastName', user?.lastName)}>
                <EditIconSvg />
              </button>
            )}
          </div>
        </div>

        {/* Phone and Email usually stay as static or follow the same pattern above */}
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
