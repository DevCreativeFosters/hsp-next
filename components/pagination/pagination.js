'use client';

import { useCallback } from 'react';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';

import styles from './pagination.module.scss';

export default function Pagination({
  current = 1,
  isMobileEllipsisCompact = false,
  maxMobilePagesToShow,
  maxPagesToShow = 3,
  onClick,
  perPage,
  removeMarginBottom = false,
  removeMarginTop = false,
  total,
  urlBase,
}) {
  const isMobile = useIsMobile();
  const totalPages = Math.ceil(total / perPage);

  const effectiveMaxPagesToShow =
    isMobile && maxMobilePagesToShow !== undefined
      ? maxMobilePagesToShow
      : maxPagesToShow;

  const pageButtons = [];

  // Special handling for maxMobilePagesToShow=2 – compromise to fit to smaller screen
  if (isMobile && maxMobilePagesToShow === 2) {
    if (current <= 2) {
      // Beginning: 1, 2, ..., totalPages
      pageButtons.push(1);
      pageButtons.push(2);

      if (totalPages > 2) {
        pageButtons.push('…');
        pageButtons.push(totalPages);
      }
    } else if (current >= totalPages - 1) {
      // End: 1, ..., totalPages-1, totalPages
      pageButtons.push(1);

      if (totalPages > 2) {
        pageButtons.push('…');
      }

      pageButtons.push(totalPages - 1);
      pageButtons.push(totalPages);
    } else {
      // Middle: 1, ..., current, ..., totalPages
      pageButtons.push(1);
      pageButtons.push('…');
      pageButtons.push(current);
      pageButtons.push('…');
      pageButtons.push(totalPages);
    }
  } else {
    const half = Math.floor((effectiveMaxPagesToShow - 1) / 2);
    let start = current - half;
    let end = current + half;

    if (start < 1) {
      start = 1;
      end = Math.min(effectiveMaxPagesToShow, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(totalPages - effectiveMaxPagesToShow + 1, 1);
    }

    if (start > 1) {
      pageButtons.push(1);
    }

    if (start > 2) {
      pageButtons.push('…');
    }

    for (let i = start; i <= end; i++) {
      pageButtons.push(i);
    }

    if (end < totalPages - 1) {
      pageButtons.push('…');
    }

    if (end < totalPages) {
      pageButtons.push(totalPages);
    }
  }

  const getPaginatedUrl = useCallback(
    pageNumber => {
      const validPageNumber = Math.min(Math.max(pageNumber, 1), totalPages);
      if (validPageNumber > 1) {
        return `${urlBase}/page-${validPageNumber}`;
      }
      return urlBase;
    },
    [totalPages, urlBase],
  );

  return (
    <div
      className={styles.pagination}
      style={{
        marginBottom: removeMarginBottom ? 0 : undefined,
        marginTop: removeMarginTop ? 0 : undefined,
      }}
    >
      <Button
        disabled={current === 1}
        {...(onClick
          ? { onClick: () => onClick(current - 1) }
          : { href: getPaginatedUrl(current - 1) })}
        rightIcon="arrow-previous"
        size="mixed"
        variant="secondary"
      />

      {pageButtons.map((value, index) => {
        const isNumber = Number.isInteger(value);
        const isCurrent = current === value;
        const isEllipsis = value === '…';
        const variant = isCurrent
          ? 'primary'
          : isNumber
            ? 'secondary'
            : 'ternary';
        return (
          <Button
            disabled={!isNumber || isCurrent}
            {...(onClick
              ? { onClick: () => onClick(value) }
              : { href: getPaginatedUrl(value) })}
            className={
              isEllipsis && isMobileEllipsisCompact
                ? styles.ellipsisCompact
                : undefined
            }
            key={`${value}-${index}`}
            size="mixed"
            variant={variant}
          >
            {value}
          </Button>
        );
      })}

      <Button
        disabled={current === totalPages}
        {...(onClick
          ? { onClick: () => onClick(current + 1) }
          : { href: getPaginatedUrl(current + 1) })}
        rightIcon="arrow-next"
        size="mixed"
        variant="secondary"
      />
    </div>
  );
}
