'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useUserContext } from '@contexts/user';
import { useWishlist } from '@contexts/wishlist';

import { fetchAPI } from '@lib/fetch-api';

import PasswordShowIcon from '@assets/icons/pwd-cross.svg';

import styles from './login-form.module.scss';

const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($email: String!) {
    forgotPassword(input: { email: $email }) {
      success
      message
    }
  }
`;

// --- GraphQL mutation for login
const LOGIN_MUTATION = `
  mutation UserLogin($username: String!, $password: String!) {
    userLogin(input: { username: $username, password: $password }) {
      token
      userId
      role
      error
      message
    }
  }
`;

function LoginForm() {
  const { setUser } = useUserContext();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { getWishlistItems } = useWishlist();
  const router = useRouter();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setUser({});
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoginMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        // ---- Forgot Password Flow ----
        const data = await fetchAPI(FORGOT_PASSWORD_MUTATION, {
          variables: { email: formData.username },
        });

        const response = data?.forgotPassword;

        if (response?.success) {
          setLoginMessage(`${response.message}`);
        } else {
          setLoginMessage(`❌ ${response?.message || 'Something went wrong'}`);
        }

        return;
      }

      // ---- Login Flow ----
      const data = await fetchAPI(LOGIN_MUTATION, { variables: formData });
      const loginResponse = data?.userLogin;

      if (loginResponse?.token) {
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem('userId', loginResponse.userId);
        localStorage.setItem('userRole', loginResponse.role);
        // Notify same-tab listeners (eg. CartProvider) that auth just changed
        // so they can re-fetch user-scoped data without a full reload.
        window.dispatchEvent(new Event('authchange'));

        setUser({
          id: loginResponse.userId,
          role: loginResponse.role,
          token: loginResponse.token,
        });

        await getWishlistItems();

        setLoginMessage(`✅ ${loginResponse.message || 'Login successful!'}`);

        router.push(`/account/${loginResponse.role}`);
      } else {
        setLoginMessage(`❌ ${loginResponse?.error || 'Invalid credentials'}`);
      }
    } catch (err) {
      setLoginMessage(`❌ Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setLoginMessage('');
      }, 5000);
    }
  };

  const togglePasswordVisibility = e => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  };

  return (
    <div className={styles.loginRight}>
      <div className={styles.formContent}>
        <div className={styles.heading}>
          <h2>{isForgotPassword ? 'Reset Your Password' : 'WELCOME BACK!'}</h2>
        </div>

        <div className={styles.formWrap}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <div className={styles.inputFullCol}>
                <div className={styles.inputGroup}>
                  <input
                    name="username"
                    onChange={handleChange}
                    placeholder={isForgotPassword ? 'Email' : 'Username'}
                    required
                    type={isForgotPassword ? 'email' : 'text'}
                    value={formData.username}
                  />
                </div>
              </div>

              {!isForgotPassword && (
                <div className={styles.inputFullCol}>
                  <div className={styles.inputGroup}>
                    <input
                      name="password"
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                    />
                    <button
                      className={styles.showPwd}
                      onClick={togglePasswordVisibility}
                      type="button"
                    >
                      <PasswordShowIcon />
                    </button>
                  </div>
                </div>
              )}

              <div className={clsx(styles.inputFullCol, styles.submitbtn)}>
                <div className={styles.inputSubmitBtn}>
                  <button disabled={loading} type="submit">
                    {loading
                      ? isForgotPassword
                        ? 'Sending...'
                        : 'Logging in...'
                      : isForgotPassword
                        ? 'Send Reset Link'
                        : 'LOGIN'}
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {loginMessage && (
                <div className={styles.inputFullCol}>
                  <p
                    style={{
                      color: loginMessage.startsWith('✅') ? 'green' : 'red',
                      fontWeight: 'bold',
                      marginBottom: '24px',
                      textAlign: 'center',
                    }}
                  >
                    {loginMessage}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {!loginMessage && (
          <div className={styles.formFooter}>
            <p>
              <Link
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setIsForgotPassword(prev => !prev);
                  setLoginMessage('');
                  setFormData({ password: '', username: '' });
                }}
              >
                {isForgotPassword ? 'Back to login' : 'Forgot Password?'}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
