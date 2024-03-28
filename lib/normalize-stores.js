import { calculateDistance } from '@lib/calculate-distance';
import PinStandard from '@assets/images/pin-standard.webp';
import PinSuper from '@assets/images/pin-super.webp';
import PinMajor from '@assets/images/pin-major.webp';

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
    let type, icon;
    const title = record.title?.toUpperCase();
    const storeCategory = record.storesCustomFields?.storeCategory[0];
    if (storeCategory === 'standard_store') {
      type = 'STANDARD';
      icon = PinStandard;
    } else if (storeCategory === 'super_store') {
      type = 'SUPER';
      icon = PinSuper;
    } else if (storeCategory === 'major_distributor') {
      type = 'MAJOR';
      icon = PinMajor;
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

    return {
      name: title,
      type,
      icon: icon.src,
      location: {
        street,
        city,
        stateAbbr,
        postalCode,
        country,
      },
      address: street,
      geolocation: {
        lat: Number(coordinates.latitude),
        lng: Number(coordinates.longitude),
      },
      displays,
      tel: tel,
      url: record.url,
      learnMoreButton,
      directions_url: directionsUrl,
      productInstallationCost,
      rankingMultiplier: record.storesCustomFields.rankingMultiplier,
    };
  });
}
