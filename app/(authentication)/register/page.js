'use client';

import { useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { fetchAPI } from '@lib/fetch-api';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import Arrow from '@assets/images/arrow.svg';
import banner from '@assets/images/banner.jpg';

import styles from './register.module.scss';

// we'll move CSS here later

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phone: '',
    role: 'seller',
    username: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const mutation = `
        mutation RegisterUser(
          $username: String!
          $email: String!
          $password: String!
          $role: String!
          $firstName: String
          $lastName: String
          $phone: String
        ) {
          userRegister(
            input: {
              username: $username
              email: $email
              password: $password
              role: $role
              firstName: $firstName
              lastName: $lastName
              phone: $phone
            }
          ) {
            userId
            error
            message
          }
        }
      `;

      const res = await fetchAPI(mutation, { variables: formData });

      const result = res?.userRegister;

      if (result?.userId && !result?.error) {
        setMessage({
          text: result?.message || '✅ Account created successfully!',
          type: 'success',
        });
      } else {
        setMessage({
          text: result?.message || result?.error || '❌ Registration failed.',
          type: 'error',
        });
      }
    } catch (err) {
      setMessage({
        text: '❌ Something went wrong. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Register">
      <section className={styles.accountContent}>
        <div className={styles.registerMain}>
          <Container>
            {/* Banner */}
            <div className={styles.formBanner}>
              <figure>
                <Image
                  alt="Register banner"
                  fill
                  src={banner}
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            </div>

            {/* Registration Form */}
            {(message === null || (message && message?.type === 'error')) && (
              <div className={styles.formContent}>
                <div className={styles.heading}>
                  <h2>LET’S GET YOU STARTED</h2>
                  <p>You are one step closer to your Ute’s Ultimate Upgrades</p>
                </div>

                {message && message.type === 'error' && (
                  <div
                    style={{
                      color: message.type === 'success' ? 'green' : 'red',
                      marginBottom: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {message.text}
                  </div>
                )}

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

                      <div className={styles.inputHalfCol}>
                        <div className={styles.inputGroup}>
                          <input
                            name="firstName"
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            type="text"
                            value={formData.firstName}
                          />
                        </div>
                      </div>

                      <div className={styles.inputHalfCol}>
                        <div className={styles.inputGroup}>
                          <input
                            name="lastName"
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                            type="text"
                            value={formData.lastName}
                          />
                        </div>
                      </div>

                      <div className={styles.inputHalfCol}>
                        <div className={styles.inputGroup}>
                          <input
                            name="phone"
                            onChange={handleChange}
                            placeholder="Phone Number"
                            type="text"
                            value={formData.phone}
                          />
                        </div>
                      </div>

                      <div className={styles.inputHalfCol}>
                        <div className={styles.inputGroup}>
                          <input
                            name="email"
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            type="email"
                            value={formData.email}
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
                            type="password"
                            value={formData.password}
                          />
                        </div>
                      </div>
                      <div className={styles.inputFullCol}>
                        <div className={styles.acceptCheckbox}>
                          <label>
                            <input type="checkbox" />
                            <span>I accept the Terms and Conditions</span>
                            <button>Read our T&Cs</button>
                          </label>
                        </div>
                      </div>

                      <div
                        className={clsx(styles.inputFullCol, styles.submitbtn)}
                      >
                        <div className={styles.inputSubmitBtn}>
                          <button disabled={loading} type="submit">
                            {loading
                              ? 'Creating Account...'
                              : 'CREATE MY ACCOUNT'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className={styles.formFooter}>
                  <p>
                    Already have an account? <Link href="/login">Log In</Link>
                  </p>
                </div>
              </div>
            )}

            {message?.type === 'success' && (
              <div className={styles.formContent}>
                <div className={styles.heading}>
                  <h2>Nearly There!</h2>
                  <p>Please Check Your Email to Complete Account Creation</p>
                </div>

                <div className={styles.backToLogin}>
                  <Link className={styles.ctaButton} href="/login">
                    Back To Login <Arrow className="arrow" />
                  </Link>
                </div>

                <div className={styles.formFooter}>
                  <p>
                    Haven’t received the email? <a href="#">Click Here</a>
                  </p>
                </div>
              </div>
            )}
          </Container>
        </div>
      </section>
    </Layout>
  );
}
