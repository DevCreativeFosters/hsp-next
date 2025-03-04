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
import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import { deleteCookie, setCookie } from '@lib/cookies';
import { getValueOrSlug } from '@lib/helpers';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

import ActionModal from '@components/builder/action-modal';
import { STEP_TITLES } from '@components/builder/builder';

const VehicleContext = createContext();

export const VehicleProvider = ({
  children,
  isProductPageWithoutMakeAndModel,
}) => {
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
  const [isProductCompatible, setIsProductCompatible] = useState(false);
  const [savedVehicleGlobal, setSavedVehicleGlobal] = useState({
    maker: '',
    model: '',
    selectedFactoryOption: [],
  });
  const [goToLink, setGoToLink] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [checkingProductCompatibility, setCheckingProductCompatibility] =
    useState(false);
  const [isPopupFirstVisit, setIsPopupFirstVisit] = useState(true);
  const wrapperRef = useRef(null);
  const enteredProductPageRef = useRef(null);
  const pathname = usePathname();
  const { slug } = params;

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
    setCheckingProductCompatibility(false);
    setIsProductCompatible(false);
    setSavedVehicleGlobal(null);
    setSelectedFactoryOption(null);
    setSelectedFactoryOption(null);
    setStepNumber(0);
    setStepTitle('');
    setVehicleSelection(null);
  };

  const handleVehicleReset = useCallback(() => {
    resetVehicleSelection();
  }, [params, pathname, router]); //eslint-disable-line

  const checkProductCompatibility = async (slug, makeSlug, modelSlug) => {
    setCheckingProductCompatibility(true);

    try {
      const data = await getProductsByCategoriesSlugs(
        slug,
        makeSlug,
        modelSlug ?? '',
      );
      setIsProductCompatible(data && data.length > 0);
    } catch (error) {
      console.error('Failed to fetch compatibility data:', error);
      setIsProductCompatible(false);
    } finally {
      setCheckingProductCompatibility(false);
    }
  };

  const handleSave = useCallback(
    async (params, hardReload) => {
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

      const localCategory = params?.mainCategorySlug || slug;
      const localMake = hardReload ? maker?.slug : params?.makeSlug;
      const localModel = hardReload ? model?.slug : params?.modelSlug;

      if (!localCategory) {
        setHeaderWidgetLoading(false);
        return;
      }

      const newRoute = routes.product(localCategory, localMake, localModel);

      if (hardReload) {
        window.location.href = newRoute;

        return;
      }

      try {
        const data = await getMainProductCategory(slug);

        if (!Object.keys(data).length) {
          return;
        }

        const contextMakeSlug = getValueOrSlug(maker);
        const contextModelSlug = getValueOrSlug(model);

        if (contextMakeSlug) {
          await checkProductCompatibility(
            slug,
            contextMakeSlug,
            contextModelSlug,
          );
        }
      } catch (error) {
        console.error('Error in handleSave:', error);
      } finally {
        setHeaderWidgetLoading(false);
      }
    },
    [maker, model, pathname, selectedFactoryOption, slug],
  );

  return (
    <VehicleContext.Provider
      value={{
        checkProductCompatibility,
        checkingProductCompatibility,
        compatibleFactoryOptions,
        covers,
        dropdownOpened,
        enteredProductPageRef,
        finalSelection,
        goToLink,
        handleSave,
        handleVehicleReset,
        headerWidgetLoading,
        isPopupFirstVisit,
        isProductCompatible:
          isProductPageWithoutMakeAndModel || isProductCompatible,
        isProductPageWithoutMakeAndModel,
        maker,
        model,
        popupOpen,
        savedVehicleGlobal,
        selectedCover,
        selectedFactoryOption,
        selectedProducts,
        setCheckingProductCompatibility,
        setCompatibleFactoryOptions,
        setCovers,
        setDropdownOpened,
        setGoToLink,
        setHeaderWidgetLoading,
        setIsPopupFirstVisit,
        setIsProductCompatible,
        setMaker,
        setModel,
        setPopupOpen,
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
