'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { useUserContext } from '@contexts/user';

import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';

import styles from './registered-products.module.scss';

const query = `
    query GetUserRegistrations {
        productRegistrations(userId: 74) {
            id
            first_name
            last_name
            product_cate {
                id
                name
                slug
                url
                image
            }
            serial_number
            purchase_date
            store_from
            created_at
        }
    }
`;

function RegisteredProducts() {
  const { user } = useUserContext();

  const [registeredProducts, setRegisteredProducts] = useState([]);

  useEffect(() => {
    async function fetchRegisteredProducts() {
      const variables = { userId: user?.id };
      const res = await fetchAPI(query, { variables });
      const data = res?.productRegistrations || [];
      setRegisteredProducts(data);
    }
    fetchRegisteredProducts();
  }, []);

  return (
    <div className={styles.registerProducts}>
      <div className={styles.heading}>
        <h3>Product Registration</h3>
        <Button
          href="/support/register-your-product"
          size="large"
          variant="primary"
        >
          Register Your New Products Here
        </Button>
      </div>
      <div className={styles.lists}>
        {registeredProducts.length > 0 &&
          registeredProducts.map((product, index) => (
            <div className={styles.productBox} key={product?.id}>
              <figure>
                <Image
                  alt={'Product Image'}
                  className={styles.productImg}
                  height={93}
                  src={product?.product_cate?.image}
                  width={100}
                />
              </figure>
              <div className={styles.info}>
                <h6>{product?.product_cate?.name}</h6>
                <div className={styles.desc}>
                  <div className={styles.left}>
                    <p>
                      <strong>Purchase Date:</strong>{' '}
                      {product?.purchase_date.split('-').reverse().join('/')}
                    </p>
                    <p>
                      <strong>Store Purchased From:</strong>{' '}
                      {product?.store_from}
                    </p>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.sNo}>
                      <p>Serial Number of Unit:</p>
                      <h4>{product?.serial_number}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RegisteredProducts;
