'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import getCompatibilityData from '@lib/api/get-compatibility-data';
import getRelatedCovers from '@lib/api/get-related-covers';
import normalizeUteBuilderProducts, {
  normalizeCompatibilityData,
} from '@lib/normalize-ute-builder-products';

import UTEChooseYourVehicle from '@components/builder/ute-choose-your-vehicle';
import Button from '@components/button/button';
import Container from '@components/container/container';
import Modal from '@components/modal/modal';
import StoreList from '@components/store-list/store-list';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';

import styles from './builder.module.scss';
import Preview from './preview';
import ProductsCarousel from './products-carousel';
import Sidebar from './sidebar';

const getOtherProductsWithSameParent = (products, productSlug, variantSlug) =>
  products.filter(
    product =>
      product.productSlug === productSlug &&
      product.variantSlug !== variantSlug,
  );

const DEFAULT_OPEN_SECTION = 'products';
const DEFAULT_STEP_NUMBER = 1;
const DEFAULT_STEP_TITLE = 'Add your UTE covering';

export default function Builder({
  makes,
  products,
  noCover,
  allLocations,
  factoryOptions,
  globalOptions,
}) {
  const [openSection, setOpenSection] = useState(DEFAULT_OPEN_SECTION);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [disabledProducts, setDisabledProducts] = useState([]);
  const [topHeight, setHeight] = useState(0);
  const [covers, setCovers] = useState([]);
  const [stepProducts, setStepProducts] = useState(products);
  const [compatibilityData, setCompatibilityData] = useState(null);
  const [stepNumber, setStepNumber] = useState(DEFAULT_STEP_NUMBER);
  const [stepTitle, setStepTitle] = useState(DEFAULT_STEP_TITLE);
  const [showModal, setShowModal] = useState(false);
  const topRef = useRef(null);
  const isMobile = useIsMobile(1280);

  const { maker: make, model, factoryOption } = useVehicleContext();

  useEffect(() => {
    if (
      !make?.slug ||
      !model?.slug ||
      !globalOptions ||
      !globalOptions?.coversCategory
    ) {
      setStepProducts(products);

      return;
    }

    getRelatedCovers(
      make.slug,
      model.slug,
      globalOptions.coversCategory.nodes[0].slug,
    ).then(relatedCovers => {
      if (!relatedCovers) {
        setStepProducts(products);

        return;
      }

      const normalizedCovers = normalizeUteBuilderProducts(relatedCovers);
      const covers = [...normalizedCovers, ...noCover];

      setStepProducts(covers);
      setCovers(covers);
    });

    getCompatibilityData(globalOptions.coversCategory.nodes[0].databaseId).then(
      data => {
        if (!data) {
          return;
        }

        const normalizedData = normalizeCompatibilityData(data);
        setCompatibilityData(normalizedData);
      },
    );
  }, [make, model, globalOptions, products, noCover]);

  const {
    location,
    searchGeolocation,
    filteredLocations,
    selectedStore,
    setSelectedStore,
    isMapVisible,
    radius,
  } = useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(
    openSection === 'store' && location && searchGeolocation && radius,
  );
  const isInlineMapVisible = Boolean(
    openSection === 'store' && !isMobile && isMapVisible,
  );

  useEffect(function setTopHeightObserver() {
    if (!topRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setHeight(topRef.current?.getBoundingClientRect().height);
    });
    resizeObserver.observe(topRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const addProduct = useCallback(
    product => {
      let newSelectedProducts = [...selectedProducts, product];

      if (covers.some(cover => cover.productSlug === product.productSlug)) {
        const isCompatibleWithFactoryOptions = compatibilityData[
          product.productSlug
        ]?.factoryOptions.filter(option => option.slug === factoryOption.slug);

        if (!isCompatibleWithFactoryOptions) {
          setShowModal(true);
          return;
        }

        newSelectedProducts = [product, ...selectedProducts];
      }

      const newDisabledProducts = [
        ...disabledProducts,
        ...getOtherProductsWithSameParent(
          products,
          products.productSlug,
          products.variantSlug,
        ),
      ];

      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(newDisabledProducts);
    },
    [
      selectedProducts,
      disabledProducts,
      products,
      factoryOption,
      covers,
      compatibilityData,
    ],
  );

  const removeProduct = useCallback(
    product => {
      const newSelectedProducts = selectedProducts.filter(
        selectedProduct => selectedProduct !== product,
      );
      const otherProductsWithSameParent = getOtherProductsWithSameParent(
        products,
        product.productSlug,
        product.variantSlug,
      );
      const newDisabledProducts = disabledProducts.filter(
        el => !otherProductsWithSameParent.includes(el),
      );

      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(newDisabledProducts);
    },
    [selectedProducts, disabledProducts, products],
  );

  const toggleProduct = useCallback(
    product => {
      selectedProducts.includes(product)
        ? removeProduct(product)
        : addProduct(product);
    },
    [selectedProducts, addProduct, removeProduct],
  );

  useEffect(() => {
    const coverSelected = selectedProducts.some(selectedProduct =>
      covers.some(cover => cover.productSlug === selectedProduct.productSlug),
    );

    if (coverSelected) {
      setStepProducts(products);
      setStepNumber(2);
      setStepTitle('Add your accessories');
    } else {
      setStepProducts(covers);
      setStepNumber(DEFAULT_STEP_NUMBER);
      setStepTitle(DEFAULT_STEP_TITLE);
    }
  }, [selectedProducts, setStepProducts, products, covers]);

  if (showModal) {
    return (
      <Modal
        title="Factory Options Clash"
        isVisible={true}
        maxWidth={900}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <p>
          For this selected HSP product to be installed, it requires the below
          factory options to be removed.
        </p>

        <ol className={styles.list}>
          <li>
            <span className={styles.listItem}>{factoryOption.name}</span>
          </li>
        </ol>
        <p>Do you want to proceed?</p>
        <div className={styles.buttons}>
          <Button
            variant={'secondary'}
            size={'large'}
            className={styles.button}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size={'large'}
            className={styles.button}
            onClick={() => {
              setShowModal(false);
            }}
          >
            Accept
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <div className={styles.builder}>
      <Container className={styles.container}>
        <div className={styles.top} ref={topRef}>
          <Sidebar
            openSection={openSection}
            setOpenSection={setOpenSection}
            selectedProducts={selectedProducts}
            removeProduct={removeProduct}
            isMobile={isMobile}
            allLocations={allLocations}
          />
          <StoreList
            className={styles.results}
            items={filteredLocations}
            show={isInlineResultListVisible}
            onSelect={item => {
              setSelectedStore(item);
            }}
            style={{
              height: selectedStore ? topHeight : null,
            }}
          />
          {make && model ? (
            <Preview
              make={make}
              model={model}
              selectedProducts={selectedProducts}
            >
              {isInlineMapVisible && (
                <StoreLocatorMap
                  className={styles.map}
                  locations={filteredLocations}
                  onMarkerClick={setSelectedStore}
                />
              )}
            </Preview>
          ) : (
            <UTEChooseYourVehicle
              makes={makes}
              factoryOptions={factoryOptions}
            />
          )}
        </div>
        {make && model && stepProducts.length > 0 && (
          <ProductsCarousel
            products={stepProducts}
            selectedProducts={selectedProducts}
            disabledProducts={disabledProducts}
            toggleProduct={toggleProduct}
            stepNumber={stepNumber}
            stepTitle={stepTitle}
          />
        )}
      </Container>
    </div>
  );
}
