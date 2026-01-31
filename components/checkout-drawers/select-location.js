import { StoreLocatorProvider } from '@contexts/store-locator';

import StoreLocatorResultsAndMap from '@components/store-locator-results-and-map/store-locator-results-and-map';
import StoreLocatorSearch from '@components/store-locator-search/store-locator-search';

function SelectLocation({ allStores, onSelect }) {
  return (
    <StoreLocatorProvider>
      <StoreLocatorSearch
        addClass={'checkout'}
        allLocations={allStores}
        noPadding={true}
        onSelect={onSelect}
      />
      <StoreLocatorResultsAndMap
        allLocations={allStores}
        hideOnMobile
        minHeightLarge
        noPadding={true}
        onSelect={onSelect}
        showFilters={false}
      />
    </StoreLocatorProvider>
  );
}
export default SelectLocation;
