'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { fetchAPI } from '@lib/fetch-api';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import Arrow from '@assets/images/arrow.svg';
import banner from '@assets/images/banner.jpg';

import './login.css';

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

export default function LoginPage() {
  const [formData, setFormData] = useState({ password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

        setLoginMessage(`✅ ${loginResponse.message || 'Login successful!'}`);
      } else {
        setLoginMessage(`❌ ${loginResponse?.error || 'Invalid credentials'}`);
      }
    } catch (err) {
      setLoginMessage(`❌ Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login - HSP">
      <section className="accountContent">
        <div className="loginMain">
          <Container>
            <div className="loginWrap">
              {/* LEFT IMAGE SIDE */}
              <div className="loginLeft">
                <figure>
                  <Image
                    alt="Login Banner"
                    fill
                    src={banner}
                    style={{ objectFit: 'cover' }}
                  />
                </figure>
              </div>

              {/* RIGHT FORM SIDE */}
              <div className="loginRight">
                <div className="formContent">
                  <div className="heading">
                    <h2>WELCOME BACK!</h2>
                    <p>Please log in to your account.</p>
                  </div>

                  <div className="formWrap">
                    <form onSubmit={handleSubmit}>
                      <div className="inputRow">
                        <div className="inputFullCol">
                          <div className="inputGroup">
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

                        <div className="inputFullCol">
                          <div className="inputGroup">
                            <input
                              name="password"
                              onChange={handleChange}
                              placeholder="Password"
                              required
                              type="password"
                              value={formData.password}
                            />
                          </div>
                        </div>

                        {/* Status Message */}
                        {loginMessage && (
                          <div className="inputFullCol">
                            <p
                              style={{
                                color: loginMessage.startsWith('✅')
                                  ? 'green'
                                  : 'red',
                                fontWeight: 500,
                                textAlign: 'center',
                              }}
                            >
                              {loginMessage}
                            </p>
                          </div>
                        )}

                        <div className="inputFullCol submitbtn">
                          <div className="inputSubmitBtn">
                            <button disabled={loading} type="submit">
                              {loading ? 'Logging in...' : 'LOGIN'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="formFooter">
                    <p>
                      <Link href="/forgot-password">Forgot Password?</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LOGIN FOOTER */}
            <div className="loginFooter">
              <div className="lfWrap">
                <div className="leftPart">
                  <h2>New to HSP?</h2>
                  <p>We’re happy to have you here!</p>
                </div>
                <div className="rightPart">
                  <Link className="ctaButton" href="/register">
                    CREATE AN ACCOUNT <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>
    </Layout>
  );
}
