import { useCallback } from 'react';

import Button from '@components/button/button';

import styles from './pagination.module.scss';

export default function Pagination({
  current = 1,
  maxPagesToShow = 3,
  onClick,
  perPage,
  total,
  urlBase,
}) {
  const totalPages = Math.ceil(total / perPage);

  const pageButtons = [];
  const half = Math.floor((maxPagesToShow - 1) / 2);
  let start = current - half;
  let end = current + half;

  if (start < 1) {
    start = 1;
    end = Math.min(maxPagesToShow, totalPages);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(totalPages - maxPagesToShow + 1, 1);
  }

  if (start > 1) {
    pageButtons.push(1);
  }

  if (start > 2) {
    pageButtons.push('...');
  }

  for (let i = start; i <= end; i++) {
    pageButtons.push(i);
  }

  if (end < totalPages - 1) {
    pageButtons.push('...');
  }

  if (end < totalPages) {
    pageButtons.push(totalPages);
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
    <div className={styles.pagination}>
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
