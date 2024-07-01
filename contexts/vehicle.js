'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { deleteCookie, setCookie } from '@lib/cookies';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

import ActionModal from '@components/builder/action-modal';
import { STEP_TITLES } from '@components/builder/builder';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  const [covers, setCovers] = useState([]);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
  const [headerWidgetLoading, setHeaderWidgetLoading] = useState(false);
  const [stepNumber, setStepNumber] = useState(0);
  const [stepTitle, setStepTitle] = useState('');
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedFactoryOption, setSelectedFactoryOption] = useState(null);
  const [compatibleFactoryOptions, setCompatibleFactoryOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [variant, setVariant] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);
  const [productNotCompatible, setProductNotCompatible] = useState(false);
  const [savedVehicleGlobal, setSavedVehicleGlobal] = useState({
    maker: '',
    model: '',
    selectedFactoryOption: [],
  });
  const [goToLink, setGoToLink] = useState('');
  const wrapperRef = useRef(null);

  const pathname = usePathname();

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
      setSelectedCover(null);
      setGoToLink('');
    }
  };

  const setVehicleSelection = vehicle => {
    setFinalSelection(vehicle);
  };

  const resetVehicleSelection = () => {
    localStorage.removeItem(LOCAL_STORAGE_VEHICLE);
    deleteCookie(LOCAL_STORAGE_VEHICLE);
    setCompatibleFactoryOptions([]);
    setMaker(null);
    setModel(null);
    setProductNotCompatible(false);
    setSavedVehicleGlobal(null);
    setSelectedFactoryOption(null);
    setSelectedFactoryOption(null);
    setStepNumber(0);
    setStepTitle('');
    setVehicleSelection(null);
  };

  const handleVehicleReset = useCallback(() => {
    setHeaderWidgetLoading(true);

    const { makeSlug, modelSlug, slug } = params;

    resetVehicleSelection();

    if (!makeSlug && !modelSlug && !slug) {
      setHeaderWidgetLoading(false);

      return;
    }

    if ((makeSlug && modelSlug && slug) || (makeSlug && slug)) {
      const newRoute = routes.product(slug);

      if (pathname !== newRoute) {
        router.prefetch(newRoute);
        router.push(newRoute);
      } else {
        setHeaderWidgetLoading(false);
      }

      return;
    }

    setHeaderWidgetLoading(false);
  }, [params, pathname, router]); // eslint-disable-line

  const handleSave = useCallback(
    (params, reload) => {
      setHeaderWidgetLoading(true);

      const vehicleString = JSON.stringify({
        maker,
        model,
        selectedFactoryOption,
      });

      localStorage.setItem(LOCAL_STORAGE_VEHICLE, vehicleString);
      setCookie(LOCAL_STORAGE_VEHICLE, vehicleString, 7);

      setSavedVehicleGlobal({ maker, model, selectedFactoryOption });

      setVehicleSelection({
        makerName: maker?.name || undefined,
        modelName: model?.name || undefined,
        selectedFactoryOption: selectedFactoryOption || null,
      });

      setDropdownOpened(false);
      setStepNumber(1);
      setStepTitle(STEP_TITLES[1]);

      let newRoute = null;
      let localCategory = null;
      let localMake = null;
      let localModel = null;

      if (params) {
        const { mainCategorySlug, makeSlug, modelSlug } = params;

        localCategory = mainCategorySlug;
        localMake = makeSlug;
        localModel = modelSlug;
      }

      if (reload) {
        const { mainCategorySlug } = params;

        localCategory = mainCategorySlug;
        localMake = maker?.slug;
        localModel = model?.slug;
      }

      if (!localCategory) {
        setHeaderWidgetLoading(false);

        return;
      }

      getMainProductCategory(localCategory).then(data => {
        if (!Object.keys(data).length) {
          setHeaderWidgetLoading(false);

          return;
        }

        newRoute = routes.product(localCategory, localMake, localModel);

        if (reload) {
          window.location.href = newRoute;

          return;
        }

        if (pathname !== newRoute) {
          router.prefetch(newRoute);
          router.push(newRoute);
          setHeaderWidgetLoading(false);
        }
      });
    },
    [maker, model, pathname, router, selectedFactoryOption],
  );

  return (
    <VehicleContext.Provider
      value={{
        compatibleFactoryOptions,
        covers,
        dropdownOpened,
        finalSelection,
        goToLink,
        handleSave,
        handleVehicleReset,
        headerWidgetLoading,
        maker,
        model,
        productNotCompatible,
        savedVehicleGlobal,
        selectedCover,
        selectedFactoryOption,
        selectedProducts,
        setCompatibleFactoryOptions,
        setCovers,
        setDropdownOpened,
        setGoToLink,
        setHeaderWidgetLoading,
        setMaker,
        setModel,
        setProductNotCompatible,
        setSavedVehicleGlobal,
        setSelectedCover,
        setSelectedFactoryOption,
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
        <ActionModal
          onAccept={handleResetModalAccept}
          onClose={handleResetModalClose}
        />
      )}
      <div ref={wrapperRef}>{children}</div>
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => useContext(VehicleContext);
