import { useCallback } from 'react';
import Button from '@components/button/button';

import styles from './pagination.module.scss';

export default function Pagination({
  perPage,
  total,
  maxPagesToShow = 3,
  current = 1,
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
        href={getPaginatedUrl(current - 1)}
        size="mixed"
        variant="secondary"
        rightIcon="arrow-previous"
        disabled={current === 1}
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
            href={getPaginatedUrl(value)}
            key={`${value}-${index}`}
            size="mixed"
            variant={variant}
            disabled={!isNumber || isCurrent}
          >
            {value}
          </Button>
        );
      })}

      <Button
        href={getPaginatedUrl(current + 1)}
        size="mixed"
        variant="secondary"
        rightIcon="arrow-next"
        disabled={current === totalPages}
      />
    </div>
  );
}
