import { calculateDistance } from '@lib/calculate-distance';

import PinStandard from '@assets/images/pin-standard.webp';

const HSP_HEADQUARTERS_COORDINATES = {
  lat: -37.95347921924772,
  lng: 145.1871773227412,
};

export default function normalizeStores(stores, searchGeolocation) {
  const sortedStores = Object.values(stores).sort((a, b) => {
    const distanceA = calculateDistance(
      a.storesCustomFields.storeLocationCoordinates,
      searchGeolocation || HSP_HEADQUARTERS_COORDINATES,
    );
    const distanceB = calculateDistance(
      b.storesCustomFields.storeLocationCoordinates,
      searchGeolocation || HSP_HEADQUARTERS_COORDINATES,
    );

    const rankingMultiplierA =
      a.storesCustomFields.rankingMultiplier.length > 0 &&
      Number(a.storesCustomFields.rankingMultiplier[0]);
    const rankingMultiplierB =
      b.storesCustomFields.rankingMultiplier.length > 0 &&
      Number(b.storesCustomFields.rankingMultiplier[0]);

    return distanceA * rankingMultiplierA - distanceB * rankingMultiplierB;
  });

  return sortedStores.map(record => {
    let color, icon, label, pinIcon;
    const title = record.title?.toUpperCase();
    const storeCategory = record.storeCategories?.nodes[0];
    const pinStandard = PinStandard;
    if (storeCategory) {
      color = storeCategory?.storeCategoryCustomFields?.color;
      icon = storeCategory?.storeCategoryCustomFields?.icon?.node?.sourceUrl;
      label = storeCategory?.name;
      pinIcon =
        storeCategory?.storeCategoryCustomFields?.pinIcon?.node?.sourceUrl;
    }

    const street = record.storesCustomFields.addressFields.streetAddress;
    const city =
      record.storesCustomFields.addressFields.city ||
      record.storesCustomFields.addressFields.cityTw;
    const stateAbbr =
      record.storesCustomFields.addressFields.state ||
      record.storesCustomFields.addressFields.stateMy ||
      record.storesCustomFields.addressFields.stateNz;
    const postalCode = record.storesCustomFields.addressFields.postalCode;
    const country = record.storesCustomFields.addressFields.country;
    const productInstallationCost =
      record.storesCustomFields.productInstallationCost;
    const coordinates = record.storesCustomFields.storeLocationCoordinates;
    const tel = record.storesCustomFields.phoneNumber;
    const directionsUrl = record.storesCustomFields.directionsLink;
    const learnMoreButton = record.storesCustomFields.learnMore;
    const displays = record.storesCustomFields.inStoreDisplays;
    const storeId = record?.storesCustomFields?.storeId;

    return {
      address: street,
      color,
      directions_url: directionsUrl,
      displays,
      geolocation: {
        lat: Number(coordinates.latitude),
        lng: Number(coordinates.longitude),
      },
      icon: pinIcon || pinStandard.src,
      id: record.databaseId,
      label,
      learnMoreButton,
      location: {
        city,
        country,
        postalCode,
        stateAbbr,
        street,
      },
      name: title,
      productInstallationCost,
      rankingMultiplier: record.storesCustomFields.rankingMultiplier,
      storeIcon: icon,
      storeId,
      tel: tel,
      url: record.url,
    };
  });
}
