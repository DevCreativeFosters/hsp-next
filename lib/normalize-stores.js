import PinStandard from '@assets/images/pin-standard.webp';
import PinSuper from '@assets/images/pin-super.webp';
import PinMajor from '@assets/images/pin-major.webp';

export default function normalizeStores(stores) {
  const sortedStores = Object.values(stores).sort((a, b) => {
    const typeRanking = {
      super_store: 0,
      major_distributor: 1,
      standard_store: 2,
    };

    return (
      typeRanking[a.storesCustomFields.storeCategory] -
      typeRanking[b.storesCustomFields.storeCategory]
    );
  });

  return sortedStores.map(record => {
    let type, icon;
    const title = record.title?.toUpperCase();
    const storeCategory = record.storesCustomFields?.storeCategory;
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
    const learnMoreUrl = record.storesCustomFields.learnMore?.url;
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
      learnMoreUrl,
      directions_url: directionsUrl,
      productInstallationCost,
    };
  });
}
