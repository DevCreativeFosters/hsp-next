'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { useUserContext } from '@contexts/user';
import { useWishlist } from '@contexts/wishlist';

import { fetchAPI } from '@lib/fetch-api';

import PasswordShowIcon from '@assets/icons/pwd-cross.svg';

import styles from './login-form.module.scss';

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
      const data = await fetchAPI(LOGIN_MUTATION, { variables: formData });

      const loginResponse = data?.userLogin;

      if (loginResponse?.token) {
        // Save token in localStorage for persistence
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem('userId', loginResponse.userId);
        localStorage.setItem('userRole', loginResponse.role);
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
    }
  };

  const togglePasswordVisibility = e => {
    e.preventDefault();
    setShowPassword(prev => !prev);
  };

  return (
    <div className={styles.formWrap}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <div className={styles.inputFullCol}>
            <div className={styles.inputGroup}>
              <input
                name="username"
                onChange={handleChange}
                placeholder="Username"
                required
                type="text"
                value={formData.username}
              />
            </div>
          </div>

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

          {/* Status Message */}
          {loginMessage && (
            <div className={styles.inputFullCol}>
              <p
                style={{
                  color: loginMessage.startsWith('✅') ? 'green' : 'red',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {loginMessage}
              </p>
            </div>
          )}

          <div className={clsx(styles.inputFullCol, styles.submitbtn)}>
            <div className={styles.inputSubmitBtn}>
              <button disabled={loading} type="submit">
                {loading ? 'Logging in...' : 'LOGIN'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
