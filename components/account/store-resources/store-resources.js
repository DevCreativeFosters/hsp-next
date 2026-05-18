'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useUserContext } from '@contexts/user';

import { getStoreByUserId } from '@lib/api/get-store-by-user-id';
import { makeRelativeUrl } from '@lib/helpers';

import Button from '@components/button/button';
import Loading from '@components/loading/loading';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import CartIcon from '@assets/icons/cart-icon-basket.svg';
import LinkIcon from '@assets/icons/link-icon.svg';

import styles from './store-resources.module.scss';

function StoreResources() {
  const { user } = useUserContext();

  const [loading, setLoading] = useState(true);
  const [storeDetails, setStoreDetails] = useState({});

  useEffect(() => {
    async function getStoreDetails() {
      if (!user?.id) return;

      const userId = user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const store = await getStoreByUserId(userId);
        setStoreDetails(store);
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    getStoreDetails();
  }, [user?.id]);

  if (loading) return <Loading color="white" size="large" />;

  return (
    <div className={styles.resourceMain}>
      <div className={styles.blackContentBox}>
        {storeDetails.marketingResources &&
          storeDetails.marketingResources?.length > 0 && (
            <>
              <h3 className={styles.sectionTitle}>Marketing Resources</h3>
              <ul>
                {storeDetails.marketingResources.map(({ link }) => (
                  <li key={link.title}>
                    <LinkIcon />
                    <Link href={makeRelativeUrl(link.url)}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        <div className={styles.cartButton}>
          <button>
            <CartIcon /> Access My Dealership Assets
          </button>
        </div>
      </div>

      {storeDetails.blocks &&
        storeDetails.blocks?.length > 0 &&
        storeDetails.blocks.map(block => (
          <div className={styles.lmsBlock} key={block.title}>
            <div className={styles.left}>
              <h4>{block.title}</h4>
              <Wysiwyg
                className={styles.description}
                content={block.description}
              />
              <Button
                className={styles.button}
                href={makeRelativeUrl(block.link.url)}
              >
                {block.link.title}
              </Button>
            </div>
            {block.image.node.sourceUrl && (
              <div className={styles.right}>
                <figure>
                  <Image
                    alt={block.image.node.altText}
                    height={188}
                    src={block.image.node.sourceUrl}
                    width={417}
                  />
                </figure>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

export default StoreResources;
