'use client';

import { Fragment, createRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
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

function Breadcrumbs({ items, className }) {
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

  const itemsWithSeparators = addSeparators(itemsNormalized);
  const itemsLength = itemsNormalized.length;
  const singleBreadcrumb =
    itemsLength > 1 ? itemsNormalized[itemsLength - 2] : null;

  return (
    <>
      <div className={clsx(styles.container, styles.short)}>
        {singleBreadcrumb && (
          <Link
            href={singleBreadcrumb.url || '#'}
            className={clsx(styles.itemLink, styles.strong)}
          >
            <span className={styles.prevSymbol} />
            {singleBreadcrumb.label}
          </Link>
        )}
      </div>
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
                href={item.url || '#'}
                size="xsmall"
                variant="secondary"
                disabled={item.disabled}
                onClick={item.onClick || null}
                key={item.type + index}
              >
                {item.label}
              </Button>
            );
          } else if (item?.label) {
            return (
              <Link
                href={item.url || '#'}
                className={clsx(styles.itemLink, {
                  [styles.strong]: item.strong,
                })}
                key={item.url + index}
              >
                {item.label}
              </Link>
            );
          } else if (item?.type === 'select') {
            return (
              <Fragment key={item.type + index}>
                <CustomSelect
                  options={item.options}
                  selectedValue={item.selectedValue}
                  placeholder={item.placeholder}
                  disabled={item.disabled}
                  onSelect={item.onSelectCallbackAndActivateNext}
                  strong={item.strong}
                  fRef={item.ref}
                />
                {item.checkbox?.visible && (
                  <label
                    key={item.checkbox.checkboxLabel + index}
                    className={styles.checkboxContainer}
                  >
                    {item.checkbox.checkboxLabel}
                    <input
                      type="checkbox"
                      checked={item.checkbox.checked}
                      onChange={item.checkbox.onChange}
                    />
                    <button className={styles.checkbox} />
                  </label>
                )}
              </Fragment>
            );
          }
        })}
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
