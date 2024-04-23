'use client';

import { Fragment, createRef, useState } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import { useVehicleContext } from '@contexts/vehicle';

import Button from '@components/button/button';
import Container from '@components/container/container';
import CustomSelect from '@components/custom-select/custom-select';

import styles from './breadcrumbs.module.scss';

const SEPARATOR = '/';

function addSeparators(items) {
  const results = [];
  items.forEach((item, index) => {
    if (index && index < items.length && !item.skipPrecedingSeparator) {
      results.push(SEPARATOR);
    }
    results.push(item);
  });
  return results;
}

function Breadcrumbs({ items, product }) {
  const { productNotCompatible, setProductNotCompatible } = useVehicleContext();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const itemsNormalized = items
    .map(item => ({
      ...item,
      ref: item.type === 'select' ? createRef() : null,
    }))
    .map((item, index, itemsWithRefs) => ({
      ...item,
      onSelectCallbackAndActivateNext: val => {
        if (typeof item?.onSelect === 'function') {
          item.onSelect(val);
        }
        const nextRef = itemsWithRefs[index + 1]?.ref;
        if (item.onSelectOpenNext && nextRef) {
          nextRef.current.dispatchEvent(new Event('open-custom-select'));
        }
      },
    }));

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const itemsWithSeparators = addSeparators(itemsNormalized);
  const itemsLength = itemsNormalized.length;
  const singleBreadcrumb = product
    ? { label: 'Products', url: '/products' }
    : itemsLength > 1
      ? itemsNormalized[itemsLength - 2]
      : null;

  return (
    <>
      <div className={clsx(styles.container, styles.short)}>
        {singleBreadcrumb && (
          <Link
            className={clsx(styles.itemLink, styles.strong)}
            href={singleBreadcrumb.url || '#'}
          >
            <span className={styles.prevSymbol} />
            {singleBreadcrumb.label}
          </Link>
        )}
        {product && (
          <Button
            className={styles.dropdownButton}
            onClick={toggleDropdown}
            rightIcon={isDropdownVisible ? 'close' : 'expand-more-primary'}
            variant="tertiary"
          />
        )}
      </div>
      {isDropdownVisible && (
        <div className={styles.productDropdowns}>
          {itemsWithSeparators.map((item, index) => {
            if (item?.type === 'button') {
              return (
                <Button
                  className={clsx(styles.applyButton, {
                    [styles.hideButton]: !item.visible,
                  })}
                  disabled={item.disabled}
                  href={item.url || '#'}
                  key={item.type + index}
                  onClick={item.onClick || null}
                  size="xsmall"
                  variant={item.variant || 'quinary'}
                >
                  {item.label}
                </Button>
              );
            } else if (item?.type === 'select') {
              return (
                <Fragment key={item.type + index}>
                  <CustomSelect
                    disabled={item.disabled}
                    fRef={item.ref}
                    onSelect={item.onSelectCallbackAndActivateNext}
                    options={item.options}
                    placeholder={item.placeholder}
                    selectedValue={item.selectedValue}
                    strong={item.strong}
                  />
                  {item.checkbox?.visible && (
                    <label
                      className={styles.checkboxContainer}
                      key={item.checkbox.checkboxLabel + index}
                    >
                      {item.checkbox.checkboxLabel}
                      <input
                        checked={item.checkbox.checked}
                        onChange={item.checkbox.onChange}
                        type="checkbox"
                      />
                      <button className={styles.checkbox} />
                    </label>
                  )}
                </Fragment>
              );
            }
          })}
        </div>
      )}
      <div className={clsx(styles.container, styles.full)}>
        {itemsWithSeparators.map((item, index) => {
          if (item === SEPARATOR) {
            return (
              <div className={styles.separator} key={item + index}>
                {SEPARATOR}
              </div>
            );
          } else if (item?.type === 'button') {
            return (
              <Button
                className={item.visible === false ? styles.hideButton : ''}
                disabled={item.disabled}
                href={item.url || '#'}
                key={item.type + index}
                onClick={item.onClick || null}
                size="xsmall"
                variant={
                  item.visible
                    ? item.variant
                      ? item.variant
                      : 'quinary'
                    : 'secondary'
                }
              >
                {item.label}
              </Button>
            );
          } else if (item?.label) {
            return (
              <Link
                className={clsx(styles.itemLink, {
                  [styles.strong]: item.strong,
                })}
                href={item.url || '#'}
                key={item.url + index}
              >
                {item.label}
              </Link>
            );
          } else if (item?.type === 'select') {
            return (
              <Fragment key={item.type + index}>
                <CustomSelect
                  disabled={item.disabled}
                  fRef={item.ref}
                  onSelect={value => {
                    item.onSelectCallbackAndActivateNext(value);
                    setProductNotCompatible(false);
                  }}
                  options={item.options}
                  placeholder={item.placeholder}
                  selectedValue={item.selectedValue}
                  strong={item.strong}
                />
                {item.checkbox?.visible && (
                  <label
                    className={styles.checkboxContainer}
                    key={item.checkbox.checkboxLabel + index}
                  >
                    {item.checkbox.checkboxLabel}
                    <input
                      checked={item.checkbox.checked}
                      onChange={item.checkbox.onChange}
                      type="checkbox"
                    />
                    <button className={styles.checkbox} />
                  </label>
                )}
              </Fragment>
            );
          }
        })}
        {productNotCompatible && (
          <div className={styles.incompatible}>
            <span className={styles.incompatibleLabel}>Note:</span> Sorry, this
            product is not available for your selected vehicle.
          </div>
        )}
      </div>
    </>
  );
}

export default function BreadcrumbsWithOptionalContainer({
  withContainer = false,
  ...props
}) {
  return withContainer ? (
    <Container>
      <Breadcrumbs {...props} />
    </Container>
  ) : (
    <Breadcrumbs {...props} />
  );
}
