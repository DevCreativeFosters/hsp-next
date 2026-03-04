'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { useUserContext } from '@contexts/user';

import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';
import Loading from '@components/loading/loading';

import styles from './registered-products.module.scss';

const query = /* GraphQL */ `
  query {
    userRegisteredProducts {
      entryId
      dateCreated
      status
      fields
      productCategory {
        id
        name
        slug
        url
        image
      }
    }
  }
`;

function RegisteredProducts() {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);

  const [registeredProducts, setRegisteredProducts] = useState([]);

  useEffect(() => {
    async function fetchRegisteredProducts() {
      setLoading(true);
      try {
        const res = await fetchAPI(query, { authToken: user?.token });
        const data = res?.userRegisteredProducts || [];

        setRegisteredProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchRegisteredProducts();
  }, []);

  return (
    <div className={styles.registerProducts}>
      <div className={styles.heading}>
        <h3>Registered Products</h3>
        <Button
          href="/support/register-your-product"
          size="large"
          variant="primary"
        >
          Register Your New Products Here
        </Button>
      </div>
      <div className={styles.lists}>
        {loading && <Loading color="white" size="large" />}
        {!loading &&
          (registeredProducts.length > 0 ? (
            registeredProducts.map(product => {
              const fields = JSON.parse(product?.fields);

              return (
                <div className={styles.productBox} key={product?.entryId}>
                  <figure>
                    <Image
                      alt={'Product Image'}
                      className={styles.productImg}
                      height={93}
                      src={product?.productCategory?.image}
                      width={100}
                    />
                  </figure>
                  <div className={styles.info}>
                    <h6>{fields?.productSubCategories?.value}</h6>
                    <div className={styles.desc}>
                      <div className={styles.left}>
                        <p>
                          <strong>Purchase Date:</strong>{' '}
                          {fields?.purchasedate?.value
                            .split(' ')[0]
                            .split('-')
                            .reverse()
                            .join('/')}
                        </p>
                        <p>
                          <strong>Store Purchased From:</strong>{' '}
                          {fields?.stores?.value === 'My store is not listed'
                            ? fields?.other?.value
                            : fields?.stores?.value}
                        </p>
                      </div>
                      <div className={styles.right}>
                        <div className={styles.sNo}>
                          <p>Serial Number of Unit:</p>
                          <h4>{fields?.serialnumberofunit?.value}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noOrders}>
              <p>Looks like you haven&apos;t registered any products yet.</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default RegisteredProducts;
