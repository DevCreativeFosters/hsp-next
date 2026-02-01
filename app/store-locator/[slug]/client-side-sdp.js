'use client';

import { useContext, useEffect, useState } from 'react';

import StoreLocatorContext from '@contexts/store-locator';

import Button from '@components/button/button';
import EnquiryModal from '@components/enquiry-form/enquiry-modal';

function ClientSideSDP({ allLocations, selectedStore }) {
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const handleOpenModal = () => setEnquiryModalOpened(true);
  const handleCloseModal = () => setEnquiryModalOpened(false);

  const { setSelectedStore } = useContext(StoreLocatorContext);

  useEffect(() => {
    setSelectedStore(selectedStore);
  }, [selectedStore]);

  return (
    <>
      <Button onClick={handleOpenModal} size="full-width" variant="primary">
        Enquire With Store
      </Button>

      {enquiryModalOpened && (
        <EnquiryModal
          allLocations={allLocations}
          enquiryFormId={21}
          onClose={handleCloseModal}
          showSelectedProducts={false}
          showTotalCost={false}
          store={selectedStore}
          swapContainers
        />
      )}
    </>
  );
}

export default ClientSideSDP;
