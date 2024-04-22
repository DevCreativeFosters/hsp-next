'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { deleteCookie, setCookie } from '@lib/cookies';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

import { STEP_TITLES } from '@components/builder/builder';
import ResetModal from '@components/choose-your-vehicle/reset-modal';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [stepTitle, setStepTitle] = useState('');
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedFactoryOptions, setSelectedFactoryOptions] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [variant, setVariant] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);
  const [savedVehicleGlobal, setSavedVehicleGlobal] = useState({
    maker: '',
    model: '',
    selectedFactoryOptions: [],
  });
  const [goToLink, setGoToLink] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const { current: wrapper } = wrapperRef;

    function handleClickEvent(event) {
      if (pathname === routes.uteBuilder && selectedProducts.length > 0) {
        event.preventDefault();
        document.body.classList.add('hideProgressBar');

        setGoToLink(event.currentTarget.href);
      }
    }

    wrapper?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', handleClickEvent);
    });

    return () => {
      wrapper?.querySelectorAll('a').forEach(link => {
        link.removeEventListener('click', handleClickEvent);
      });
    };
  }, [goToLink, pathname, selectedProducts, wrapperRef]);

  const handleResetModalClose = () => {
    setGoToLink('');
  };

  const handleResetModalAccept = () => {
    document.body.classList.remove('hideProgressBar');
    router.push(goToLink);

    if (goToLink === routes.uteBuilder) {
      setSelectedProducts([]);
      setGoToLink('');
    }
  };

  const setVehicleSelection = vehicle => {
    setFinalSelection(vehicle);
  };

  const handleVehicleReset = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_VEHICLE);
    deleteCookie(LOCAL_STORAGE_VEHICLE);
    setMaker(null);
    setModel(null);
    setVehicleSelection(null);
    setSavedVehicleGlobal(null);
    setSelectedFactoryOptions(null);
    setStepNumber(0);
    setStepTitle('');

    const slug = pathname.split('/products/')[1]?.split('/')[0];
    if (slug) {
      router.push(routes.product(slug));
    }
  }, [pathname, router]);

  const handleSave = useCallback(
    (params, reload) => {
      const vehicleString = JSON.stringify({
        maker,
        model,
        selectedFactoryOptions,
      });
      localStorage.setItem(LOCAL_STORAGE_VEHICLE, vehicleString);
      setCookie(LOCAL_STORAGE_VEHICLE, vehicleString, 7);

      setSavedVehicleGlobal({ maker, model, selectedFactoryOptions });

      setVehicleSelection({
        makerName: maker?.name || undefined,
        modelName: model?.name || undefined,
        selectedFactoryOptions: selectedFactoryOptions || null,
      });

      setDropdownOpened(false);
      setStepNumber(1);
      setStepTitle(STEP_TITLES[1]);

      if (params) {
        const { mainCategorySlug, makeSlug, modelSlug } = params;

        if (!mainCategorySlug || !makeSlug || !modelSlug) {
          return;
        }

        const newRoute = routes.product(
          mainCategorySlug,
          makeSlug,
          modelSlug,
          variant?.slug,
        );

        router.push(newRoute);
      }

      if (reload) {
        const { mainCategorySlug } = params;
        const newRoute = routes.product(
          mainCategorySlug,
          maker?.slug,
          model?.slug,
        );

        router.push(newRoute);
      }
    },
    [maker, model, router, selectedFactoryOptions, variant],
  );

  return (
    <VehicleContext.Provider
      value={{
        dropdownOpened,
        finalSelection,
        goToLink,
        handleSave,
        handleVehicleReset,
        maker,
        model,
        savedVehicleGlobal,
        selectedCover,
        selectedFactoryOptions,
        selectedProducts,
        setDropdownOpened,
        setGoToLink,
        setMaker,
        setModel,
        setSavedVehicleGlobal,
        setSelectedCover,
        setSelectedFactoryOptions,
        setSelectedProducts,
        setStepNumber,
        setStepTitle,
        setVariant,
        setVehicleSelection,
        stepNumber,
        stepTitle,
        variant,
      }}
    >
      {goToLink && (
        <ResetModal
          onAccept={handleResetModalAccept}
          onClose={handleResetModalClose}
        />
      )}
      <div ref={wrapperRef}>{children}</div>
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => useContext(VehicleContext);
