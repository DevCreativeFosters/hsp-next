import { StoreLocatorProvider } from '@contexts/store-locator';

import StoreLocatorResultsAndMap from '@components/store-locator-results-and-map/store-locator-results-and-map';
import StoreLocatorSearch from '@components/store-locator-search/store-locator-search';

function ClickCollect({ allStores, onSelect }) {
  return (
    <StoreLocatorProvider>
      <StoreLocatorSearch
        addClass={'checkout'}
        allLocations={allStores}
        onSelect={onSelect}
      />
      <StoreLocatorResultsAndMap
        allLocations={allStores}
        minHeightLarge
        onSelect={onSelect}
      />
    </StoreLocatorProvider>
  );
}

export default ClickCollect;
