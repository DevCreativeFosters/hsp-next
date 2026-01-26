import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getStoreBySlug } from '@lib/api/get-store-by-slug';

import Button from '@components/button/button';
import Layout from '@components/layout/layout';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import StoreDisplays from '@components/store-displays/store-displays';

import styles from './page.module.scss';

export default async function StorePage({ params }) {
  const store = await getStoreBySlug(params.slug);

  if (!store) {
    notFound();
  }

  const storesCustomFields = store.storesCustomFields || {};

  return (
    <Layout>
      <Suspense fallback={null}>
        <h1 className={styles.title}>{store.title}</h1>
        <Image
          alt={storesCustomFields.featuredImage.node.altText}
          height={1000}
          src={storesCustomFields.featuredImage.node.sourceUrl}
          width={1000}
        />
        {storesCustomFields.tradingHours.map((hour, index) => (
          <div key={`${hour.day}-${index}`}>
            <h2>{hour.day}</h2>
            {hour.open && hour.close ? (
              <p>
                {hour.open} - {hour.close}
              </p>
            ) : (
              <p>Closed</p>
            )}
          </div>
        ))}
        <Button size="full-width" variant="primary">
          Enquire With Store
        </Button>
        <Button
          href={storesCustomFields.directionsLink}
          size="full-width"
          variant="secondary"
        >
          Get Directions
        </Button>

        <ul>
          {/* Site Link */}
          {storesCustomFields.siteLink && (
            <li>
              <Link
                href={storesCustomFields.siteLink.url}
                target={storesCustomFields.siteLink.target}
              >
                {storesCustomFields.siteLink.url}
              </Link>
            </li>
          )}
          {/* Address */}
          {storesCustomFields.addressFields && (
            <li>
              {storesCustomFields.addressFields.streetAddress},{' '}
              {storesCustomFields.addressFields.city}{' '}
              {storesCustomFields.addressFields.state}{' '}
              {storesCustomFields.addressFields.postalCode}
            </li>
          )}
          {/* Phone Number */}
          {storesCustomFields.phoneNumber && (
            <li>
              <Link href={`tel:${storesCustomFields.phoneNumber}`}>
                {storesCustomFields.phoneNumber}
              </Link>
            </li>
          )}
          {/* In-Store Displays */}
        </ul>
        {storesCustomFields?.inStoreDisplays && (
          <div>
            <StoreDisplays
              alwaysOpen
              displays={storesCustomFields?.inStoreDisplays}
              flexStoresList
              hideSeparator
              showNumberOfProducts={false}
            />
          </div>
        )}
        {/* Gallery */}
        {storesCustomFields?.images?.nodes &&
          storesCustomFields?.images?.nodes?.length > 0 && (
            <ProductImageCarousel
              images={storesCustomFields?.images?.nodes}
              showMainImage={false}
            />
          )}
      </Suspense>
    </Layout>
  );
}
