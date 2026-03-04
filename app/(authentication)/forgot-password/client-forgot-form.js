'use client';

import { useState } from 'react';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';

import { fetchAPI } from '@lib/fetch-api';

import PasswordShowIcon from '@assets/icons/pwd-cross.svg';

import styles from './forgot-password.module.scss';

const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword(
    $login: String!
    $key: String!
    $newPassword: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      input: {
        login: $login
        key: $key
        newPassword: $newPassword
        confirmPassword: $confirmPassword
      }
    ) {
      success
      message
    }
  }
`;

function ClientForgotForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // get values from reset link
  const login = searchParams.get('login');
  const key = searchParams.get('key');

  const [formData, setFormData] = useState({
    confirmPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage({});

    setLoading(true);

    try {
      const data = await fetchAPI(RESET_PASSWORD_MUTATION, {
        variables: {
          confirmPassword: formData.confirmPassword,
          key,
          login,
          newPassword: formData.newPassword,
        },
      });

      const response = data?.resetPassword;

      if (response?.success) {
        setMessage({
          message: response.message,
          success: true,
        });
      } else {
        setMessage({
          message: response?.message || 'Something went wrong',
          success: false,
        });
      }
    } catch (err) {
      setMessage({
        message: err.message || 'Something went wrong',
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <div className={styles.loginRight}>
      <div className={styles.formContent}>
        <div className={styles.heading}>
          <h2>{message?.success ? 'SUCCESS!' : 'FORGOT PASSWORD?'}</h2>
          <p>
            {message?.success
              ? message.message
              : 'No Worries! Reset Your Password Below:'}
          </p>
        </div>

        {message?.message && message?.success ? (
          <div className={styles.formWrap}>
            <div className={clsx(styles.inputFullCol, styles.submitbtn)}>
              <div className={styles.inputSubmitBtn}>
                <button
                  disabled={loading}
                  onClick={() => router.push('/login')}
                >
                  {loading ? 'Loading...' : 'Back to Login'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.formWrap}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputRow}>
                {/* New Password */}
                <div className={styles.inputFullCol}>
                  <div className={styles.inputGroup}>
                    <input
                      name="newPassword"
                      onChange={handleChange}
                      placeholder="New Password"
                      required
                      type={showNewPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                    />

                    <button
                      className={styles.showPwd}
                      onClick={toggleNewPasswordVisibility}
                      type="button"
                    >
                      <PasswordShowIcon />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className={styles.inputFullCol}>
                  <div className={styles.inputGroup}>
                    <input
                      name="confirmPassword"
                      onChange={handleChange}
                      placeholder="Re-Enter New Password"
                      required
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                    />

                    <button
                      className={styles.showPwd}
                      onClick={toggleConfirmPasswordVisibility}
                      type="button"
                    >
                      <PasswordShowIcon />
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className={clsx(styles.inputFullCol, styles.submitbtn)}>
                  <div className={styles.inputSubmitBtn}>
                    <button disabled={loading} type="submit">
                      {loading ? 'Setting Password...' : 'RESET PASSWORD'}
                    </button>
                  </div>
                </div>

                {message?.message && (
                  <div className={styles.inputFullCol}>
                    <p
                      style={{
                        color: 'red',
                        fontWeight: 'bold',
                        marginBottom: '24px',
                        textAlign: 'center',
                      }}
                    >
                      {message?.message}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientForgotForm;
