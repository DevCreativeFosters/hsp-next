import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getStoreBySlug } from '@lib/api/get-store-by-slug';

import Button from '@components/button/button';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import StoreDisplays from '@components/store-displays/store-displays';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import CallIcon from '@assets/icons/call-circle-icon.svg';
import LocationIcon from '@assets/icons/location-circle-icon.svg';
import WebIcon from '@assets/icons/web-circle-icon.svg';

import styles from './page.module.scss';
import './styles.scss';

export default async function StorePage({ params }) {
  const store = await getStoreBySlug(params.slug);

  if (!store) {
    notFound();
  }

  const storesCustomFields = store.storesCustomFields || {};

  return (
    <Layout>
      <Suspense fallback={null}>
        <Container>
          <div className={styles.mobileHeading}>
            <h1 className={styles.title}>{store.title}</h1>
            {store.storeCategories.nodes.map((category, index) => (
              <button
                key={index}
                style={{
                  color: category?.storeCategoryCustomFields?.color,
                }}
              >
                <Image
                  alt={category?.name}
                  height={24}
                  src={
                    category?.storeCategoryCustomFields?.icon?.node?.sourceUrl
                  }
                  width={24}
                />
                {category?.name}
              </button>
            ))}
          </div>
          {storesCustomFields?.featuredImage?.node?.sourceUrl && (
            <div className={styles.featuredImage}>
              <Image
                alt={storesCustomFields?.featuredImage?.node?.altText}
                height={1000}
                src={storesCustomFields?.featuredImage?.node?.sourceUrl}
                width={1000}
              />
            </div>
          )}

          <div className={styles.aboutInfo}>
            <div className={styles.aboutInfoContent}>
              <div className={styles.leftPart}>
                <h1 className={styles.title}>{store.title}</h1>
                <Wysiwyg
                  className={styles.wysiwyg}
                  content={storesCustomFields.description}
                />
              </div>
              <div className={styles.rightPart}>
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
              </div>
            </div>
          </div>

          <div className={styles.tradingHoursAndLinks}>
            <div className={styles.leftPart}>
              <div className={styles.hrsBox}>
                <h4>Trading Hours</h4>
                {storesCustomFields?.tradingHours?.map((hour, index) => (
                  <div className={styles.day} key={`${hour.day}-${index}`}>
                    <p>{hour.day}</p>
                    {hour.open && hour.close ? (
                      <p>
                        {hour.open} - {hour.close}
                      </p>
                    ) : (
                      <p>Closed</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.rightPart}>
              <ul>
                {store.storeCategories.nodes.map((category, index) => (
                  <li
                    key={index}
                    style={{
                      color: category.storeCategoryCustomFields.color,
                    }}
                  >
                    <Image
                      alt={category.name}
                      height={50}
                      src={
                        category.storeCategoryCustomFields.icon.node.sourceUrl
                      }
                      width={50}
                    />
                    {category.name}
                  </li>
                ))}
                {/* Site Link */}
                {storesCustomFields.siteLink && (
                  <li>
                    <WebIcon />
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
                    <LocationIcon />
                    {storesCustomFields.addressFields.streetAddress},{' '}
                    {storesCustomFields.addressFields.city}{' '}
                    {storesCustomFields.addressFields.state}{' '}
                    {storesCustomFields.addressFields.postalCode}
                  </li>
                )}
                {/* Phone Number */}
                {storesCustomFields.phoneNumber && (
                  <li>
                    <CallIcon />
                    <Link href={`tel:${storesCustomFields.phoneNumber}`}>
                      {storesCustomFields.phoneNumber}
                    </Link>
                  </li>
                )}
                {/* In-Store Displays */}
              </ul>
            </div>
          </div>

          {storesCustomFields?.inStoreDisplays && (
            <div className={styles.storeDisplaysSection}>
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
          <div className={styles.galleryMain}>
            {storesCustomFields?.images?.nodes &&
              storesCustomFields?.images?.nodes?.length > 0 && (
                <ProductImageCarousel
                  images={storesCustomFields?.images?.nodes}
                  showMainImage={false}
                />
              )}
          </div>
        </Container>
      </Suspense>
    </Layout>
  );
}
